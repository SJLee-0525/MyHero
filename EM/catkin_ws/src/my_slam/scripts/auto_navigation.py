#!/usr/bin/env python3

import rospy
import math
import random
from nav_msgs.msg import OccupancyGrid
from geometry_msgs.msg import PoseStamped
from visualization_msgs.msg import Marker, MarkerArray
from actionlib_msgs.msg import GoalStatusArray
import tf

class AutoNavigation:
    def __init__(self):
        rospy.init_node('auto_navigation', anonymous=True)
        
        # 맵 구독
        self.map_sub = rospy.Subscriber('/map', OccupancyGrid, self.map_callback)
        # 목표점 발행
        self.goal_pub = rospy.Publisher('/move_base_simple/goal', PoseStamped, queue_size=1)
        # 시각화를 위한 마커 발행
        self.marker_pub = rospy.Publisher('/navigation_points', MarkerArray, queue_size=1)
        # move_base 상태 구독
        self.status_sub = rospy.Subscriber('/move_base/status', GoalStatusArray, self.status_callback)
        
        self.occupancy_grid = None
        self.nav_points = []
        self.is_moving = False
        self.current_orientation = 0.0  # 현재 로봇의 방향 (라디안)
        self.prev_goal = None  # 이전 목표점 저장
        self.tf_listener = tf.TransformListener()
        
        # 5초 후에 첫 목표점 선택을 시작하도록 타이머 설정
        rospy.Timer(rospy.Duration(10), self.initial_goal_timer_callback, oneshot=True)

    def initial_goal_timer_callback(self, event):
        if not self.nav_points:  # 아직 목표점이 없는 경우에만
            self.select_and_send_new_goal()
    
    def map_callback(self, occupancy_grid):
        self.occupancy_grid = occupancy_grid
        # 타이머에서 처리하도록 이 부분 제거
        # if not self.nav_points:
        #     self.select_and_send_new_goal()
    
    def status_callback(self, status):
        # status가 비어있거나 이동 중이 아니면 리턴
        if not status.status_list or not self.is_moving:
            return
            
        # 가장 최근 상태 확인 (status.status_list의 마지막 요소)
        current_status = status.status_list[-1].status
        
        # 목표 도달(3) 또는 실패(4)한 경우 새로운 목표점 선택
        if current_status in [3, 4]:
            if self.nav_points:
                # 현재 목표점의 방향을 저장
                self.current_orientation = math.atan2(
                    2 * self.prev_goal.pose.orientation.w * self.prev_goal.pose.orientation.z,
                    1 - 2 * self.prev_goal.pose.orientation.z * self.prev_goal.pose.orientation.z
                )
            self.is_moving = False
            rospy.sleep(1.0)  # 잠시 대기
            self.select_and_send_new_goal()

    def get_robot_orientation(self):
        try:
            # map 프레임에서 base_link의 transform 정보 획득
            (trans, rot) = self.tf_listener.lookupTransform('/map', '/base_link', rospy.Time(0))
            # Quaternion을 Euler angles로 변환
            euler = tf.transformations.euler_from_quaternion(rot)
            # yaw 각도 반환 (z축 회전)
            return euler[2]
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            if self.prev_goal:
                # tf 획득 실패시 이전 방식으로 폴백
                return math.atan2(
                    2 * self.prev_goal.pose.orientation.w * self.prev_goal.pose.orientation.z,
                    1 - 2 * self.prev_goal.pose.orientation.z * self.prev_goal.pose.orientation.z
                )
            return 0.0

    def select_and_send_new_goal(self):
        if self.occupancy_grid is None:
            return
            
        # 새로운 빈 공간들 찾기
        empty_points = self.find_empty_spaces(self.occupancy_grid)
        
        if not empty_points:
            return

        # 현재 방향을 기준으로 전방 120도 영역 내의 점들만 필터링
        forward_points = []
        current_orientation = self.get_robot_orientation()  # 실시간 로봇 방향 획득
        
        try:
            # 현재 로봇의 위치 획득
            (current_pos, rot) = self.tf_listener.lookupTransform('/map', '/base_link', rospy.Time(0))
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            return

        for point in empty_points:
            # 현재 로봇 위치에서 목표점까지의 각도 계산
            dx = point[0] - current_pos[0]
            dy = point[1] - current_pos[1]
            angle = math.atan2(dy, dx)
            
            # 각도 차이 계산 (-π ~ π 범위로 정규화)
            angle_diff = angle - current_orientation
            while angle_diff > math.pi:
                angle_diff -= 2 * math.pi
            while angle_diff < -math.pi:
                angle_diff += 2 * math.pi
            
            # 전방 90도 영역 내에 있는 점만 선택 (-45도 ~ +45도)
            if abs(angle_diff) <= math.pi/4:  # π/4 = 45도
                forward_points.append(point)

        if forward_points:
            selected_point = random.choice(forward_points)
            self.nav_points = [selected_point]
            self.visualize_points()
            
            # 목표점으로의 방향 계산
            if self.prev_goal:
                dx = selected_point[0] - self.prev_goal.pose.position.x
                dy = selected_point[1] - self.prev_goal.pose.position.y
                yaw = math.atan2(dy, dx)
            else:
                yaw = 0.0  # 첫 목표점은 정면 방향
            
            # 방향을 quaternion으로 변환
            w = math.cos(yaw/2)
            z = math.sin(yaw/2)
            
            goal = PoseStamped()
            goal.header.frame_id = "map"
            goal.header.stamp = rospy.Time.now()
            goal.pose.position.x = selected_point[0]
            goal.pose.position.y = selected_point[1]
            goal.pose.orientation.w = w
            goal.pose.orientation.z = z
            
            self.prev_goal = goal  # 현재 목표점 저장
            self.goal_pub.publish(goal)
            self.is_moving = True
            rospy.loginfo(f"새로운 목표점 선택: {selected_point}, 방향: {math.degrees(yaw)}도")

    def find_empty_spaces(self, occupancy_grid):
        empty_points = []
        height = occupancy_grid.info.height
        width = occupancy_grid.info.width
        resolution = occupancy_grid.info.resolution
        
        # 현재 위치 가져오기
        try:
            (current_pos, rot) = self.tf_listener.lookupTransform('/map', '/base_link', rospy.Time(0))
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            if self.prev_goal:
                current_pos = (self.prev_goal.pose.position.x, self.prev_goal.pose.position.y, 0)
            else:
                return empty_points

        # 격자 간격으로 샘플링 (모든 빈 칸을 검사하지 않고 일정 간격으로)
        grid_step = 10  # 격자 간격 조절 (0.5m 간격)
        max_distance = 3.0  # 최대 5m 거리

        for i in range(0, width, grid_step):
            for j in range(0, height, grid_step):
                if occupancy_grid.data[j * width + i] == 0:  # 빈 공간
                    x = i * resolution + occupancy_grid.info.origin.position.x
                    y = j * resolution + occupancy_grid.info.origin.position.y
                    
                    # 현재 위치에서의 거리 계산
                    distance = math.sqrt((x - current_pos[0])**2 + (y - current_pos[1])**2)
                    
                    # 5m 이내의 점들만 추가
                    if distance <= max_distance:
                        empty_points.append((x, y))
        
        return self.filter_points(empty_points)

    def filter_points(self, points, min_distance=0.5):  # 최소 간격을 0.5m로 설정
        filtered = []
        for point in points:
            if not filtered or all(self.get_distance(point, p) > min_distance for p in filtered):
                filtered.append(point)
        return filtered
    
    def get_distance(self, p1, p2):
        return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
    
    def visualize_points(self):
        marker_array = MarkerArray()
        for i, (x, y) in enumerate(self.nav_points):
            marker = Marker()
            marker.header.frame_id = "map"
            marker.type = Marker.SPHERE
            marker.action = Marker.ADD
            marker.scale.x = 0.2
            marker.scale.y = 0.2
            marker.scale.z = 0.2
            marker.color.a = 1.0
            marker.color.r = 1.0
            marker.color.g = 0.0
            marker.color.b = 0.0
            marker.pose.position.x = x
            marker.pose.position.y = y
            marker.id = i
            marker_array.markers.append(marker)
        
        self.marker_pub.publish(marker_array)
    
    def send_goal(self, point):
        goal = PoseStamped()
        goal.header.frame_id = "map"
        goal.header.stamp = rospy.Time.now()
        goal.pose.position.x = point[0]
        goal.pose.position.y = point[1]
        # 랜덤한 방향 설정 (4방향 중 하나)
        orientations = [
            (1.0, 0.0),  # 0도
            (0.707, 0.707),  # 90도
            (0.0, 1.0),  # 180도
            (-0.707, 0.707),  # 270도
        ]
        w, z = random.choice(orientations)
        goal.pose.orientation.w = w
        goal.pose.orientation.z = z
        self.goal_pub.publish(goal)

if __name__ == '__main__':
    try:
        auto_nav = AutoNavigation()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass