#!/usr/bin/env python3

import rospy
import math
import random
from nav_msgs.msg import OccupancyGrid
from geometry_msgs.msg import PoseStamped
from visualization_msgs.msg import Marker, MarkerArray
from actionlib_msgs.msg import GoalStatusArray
import tf
from std_msgs.msg import Bool

class AutonomousExploration:
    def __init__(self):
        rospy.init_node('autonomous_exploration', anonymous=True)
        
        # 맵, 비용 정보, 상태, 마커, 목표 발행 관련 노드
        self.map_sub = rospy.Subscriber('/map', OccupancyGrid, self.map_callback)
        self.costmap_sub = rospy.Subscriber('/move_base/global_costmap/costmap', OccupancyGrid, self.costmap_callback)
        self.goal_pub = rospy.Publisher('/move_base_simple/goal', PoseStamped, queue_size=1)
        self.marker_pub = rospy.Publisher('/navigation_points', MarkerArray, queue_size=1)
        self.status_sub = rospy.Subscriber('/move_base/status', GoalStatusArray, self.status_callback)
        
        # 활성화 상태 구독
        self.enable_sub = rospy.Subscriber('/exploration_enable', Bool, self.enable_callback)
        self.is_enabled = False
        
        self.occupancy_grid = None
        self.global_costmap = None
        self.nav_points = []
        self.is_moving = False
        self.current_orientation = 0.0
        self.prev_goal = None
        self.tf_listener = tf.TransformListener()
        
        rospy.Timer(rospy.Duration(10), self.initial_goal_timer_callback, oneshot=True)
    
    def costmap_callback(self, costmap):
        self.global_costmap = costmap
    
    def map_callback(self, occupancy_grid):
        self.occupancy_grid = occupancy_grid
    
    def status_callback(self, status):
        if not status.status_list or not self.is_moving:
            return
        current_status = status.status_list[-1].status
        # 상태 코드 3(SUCCEEDED) 또는 4(ABORTED)일 때 새 목표 선택
        if current_status in [3, 4]:
            if self.nav_points:
                self.current_orientation = math.atan2(
                    2 * self.prev_goal.pose.orientation.w * self.prev_goal.pose.orientation.z,
                    1 - 2 * self.prev_goal.pose.orientation.z * self.prev_goal.pose.orientation.z
                )
            self.is_moving = False
            rospy.sleep(7.0)
            self.select_and_send_new_goal()
    
    def initial_goal_timer_callback(self, event):
        if not self.nav_points:
            self.select_and_send_new_goal()
    
    def get_robot_orientation(self):
        try:
            (trans, rot) = self.tf_listener.lookupTransform('/map', '/base_link', rospy.Time(0))
            euler = tf.transformations.euler_from_quaternion(rot)
            return euler[2]
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            if self.prev_goal:
                return math.atan2(
                    2 * self.prev_goal.pose.orientation.w * self.prev_goal.pose.orientation.z,
                    1 - 2 * self.prev_goal.pose.orientation.z * self.prev_goal.pose.orientation.z
                )
            return 0.0
    
    def select_and_send_new_goal(self):
        if not self.is_enabled or self.occupancy_grid is None or self.global_costmap is None:
            return
            
        empty_points = self.find_empty_spaces(self.occupancy_grid)
        if not empty_points:
            rospy.logwarn("전방 60도 내에서 적절한 빈 영역을 찾지 못했습니다.")
            return

        try:
            (current_pos, _) = self.tf_listener.lookupTransform('/map', '/base_link', rospy.Time(0))
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            return

        # 가장 먼 포인트 선택 (더 멀리 탐색하도록)
        selected_point = max(empty_points, 
                            key=lambda p: math.sqrt((p[0]-current_pos[0])**2 + (p[1]-current_pos[1])**2))

        self.nav_points = [selected_point]
        self.visualize_points()
        
        # 목표점의 방향 계산
        if self.prev_goal:
            dx = selected_point[0] - current_pos[0]  # 현재 위치 기준으로 방향 계산
            dy = selected_point[1] - current_pos[1]
            yaw = math.atan2(dy, dx)
        else:
            yaw = 0.0
        
        w = math.cos(yaw/2)
        z = math.sin(yaw/2)
        
        goal = PoseStamped()
        goal.header.frame_id = "map"
        goal.header.stamp = rospy.Time.now()
        goal.pose.position.x = selected_point[0]
        goal.pose.position.y = selected_point[1]
        goal.pose.orientation.w = w
        goal.pose.orientation.z = z

        self.prev_goal = goal
        self.goal_pub.publish(goal)
        self.is_moving = True
        rospy.loginfo(f"새로운 목표점 선택: {selected_point}, 방향: {math.degrees(yaw)}도")
        
        # 5초 대기
        rospy.sleep(7.0)

    def enable_callback(self, msg):
        self.is_enabled = msg.data
        if self.is_enabled:
            rospy.loginfo("자율 탐색 모드 활성화")
            self.select_and_send_new_goal()
        else:
            rospy.loginfo("자율 탐색 모드 비활성화")
    
    def find_empty_spaces(self, occupancy_grid):
        empty_points = []
        height = occupancy_grid.info.height
        width = occupancy_grid.info.width
        resolution = occupancy_grid.info.resolution
        
        try:
            (current_pos, _) = self.tf_listener.lookupTransform('/map', '/base_link', rospy.Time(0))
            current_orientation = self.get_robot_orientation()
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            if self.prev_goal:
                current_pos = (self.prev_goal.pose.position.x, self.prev_goal.pose.position.y, 0)
                current_orientation = math.atan2(
                    2 * self.prev_goal.pose.orientation.w * self.prev_goal.pose.orientation.z,
                    1 - 2 * self.prev_goal.pose.orientation.z * self.prev_goal.pose.orientation.z
                )
            else:
                return empty_points

        # 파라미터 조정
        grid_step = 10  # 격자 간격
        max_distance = 5.0  # 최대 거리
        min_distance = 2.0  # 최소 거리
        cost_threshold = 50  # 비용 임계값
        check_range = 5  # 1m 반경 체크 (resolution이 0.05m일 때)
        angle_range = math.pi/3  # 60도

        for i in range(0, width, grid_step):
            for j in range(0, height, grid_step):
                index = j * width + i
                
                if index >= len(occupancy_grid.data) or index >= len(self.global_costmap.data):
                    continue

                # 현재 위치에서 격자점까지의 방향 계산
                x = i * resolution + occupancy_grid.info.origin.position.x
                y = j * resolution + occupancy_grid.info.origin.position.y
                angle_to_point = math.atan2(y - current_pos[1], x - current_pos[0])
                
                # 각도 차이 계산 (-π에서 π 사이로 정규화)
                angle_diff = angle_to_point - current_orientation
                while angle_diff > math.pi: angle_diff -= 2*math.pi
                while angle_diff < -math.pi: angle_diff += 2*math.pi
                
                # 전방 ±60도 범위 안에 있는지 확인
                if abs(angle_diff) > angle_range:
                    continue

                # 1m x 1m 영역이 비어있는지 확인
                is_area_safe = True
                for di in range(-check_range, check_range + 1):
                    for dj in range(-check_range, check_range + 1):
                        ni = i + di
                        nj = j + dj
                        if 0 <= ni < width and 0 <= nj < height:
                            neighbor_index = nj * width + ni
                            if (neighbor_index < len(occupancy_grid.data) and 
                                (occupancy_grid.data[neighbor_index] > 0 or  # 장애물이거나
                                 self.global_costmap.data[neighbor_index] >= cost_threshold)):  # 비용이 높으면
                                is_area_safe = False
                                break
                    if not is_area_safe:
                        break

                if is_area_safe:
                    distance = math.sqrt((x - current_pos[0])**2 + (y - current_pos[1])**2)
                    if min_distance <= distance <= max_distance:
                        empty_points.append((x, y))

        return empty_points
    
    def find_empty_spaces_fallback(self, occupancy_grid):
        # 더 관대한 조건으로 재시도
        empty_points = []
        height = occupancy_grid.info.height
        width = occupancy_grid.info.width
        resolution = occupancy_grid.info.resolution
        
        grid_step = 20  # 더 큰 간격
        cost_threshold = 80  # 더 높은 임계값
        
        for i in range(0, width, grid_step):
            for j in range(0, height, grid_step):
                index = j * width + i
                if index >= len(occupancy_grid.data):
                    continue
                if occupancy_grid.data[index] == 0:  # 단순히 빈 공간인지만 체크
                    x = i * resolution + occupancy_grid.info.origin.position.x
                    y = j * resolution + occupancy_grid.info.origin.position.y
                    empty_points.append((x, y))
        
        return self.filter_points(empty_points)
    
    def filter_points(self, points, min_distance=0.5):
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
    

if __name__ == '__main__':
    try:
        auto_nav = AutonomousExploration()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass
