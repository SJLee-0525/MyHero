#!/usr/bin/env python3

import rospy
import math
import random
from nav_msgs.msg import OccupancyGrid
from geometry_msgs.msg import PoseStamped
from visualization_msgs.msg import Marker, MarkerArray
from actionlib_msgs.msg import GoalStatusArray
from sensor_msgs.msg import Joy  # 추가
import tf

class AutoNavigation:
    def __init__(self):
        rospy.init_node('auto_navigation', anonymous=True)
        
        # 맵, 비용 정보, 상태, 마커, 목표 발행 관련 노드
        self.map_sub = rospy.Subscriber('/map', OccupancyGrid, self.map_callback)
        self.costmap_sub = rospy.Subscriber('/move_base/global_costmap/costmap', OccupancyGrid, self.costmap_callback)
        self.goal_pub = rospy.Publisher('/move_base_simple/goal', PoseStamped, queue_size=1)
        self.marker_pub = rospy.Publisher('/navigation_points', MarkerArray, queue_size=1)
        self.status_sub = rospy.Subscriber('/move_base/status', GoalStatusArray, self.status_callback)
        
        # 조이스틱 구독 추가 (토글용)
        self.joy_sub = rospy.Subscriber('/joy', Joy, self.joy_callback)
        self.auto_mode = True  # 기본은 자동 모드
        
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
            rospy.sleep(1.0)
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
        # 수동 모드일 경우 새 목표 발행하지 않음
        if not self.auto_mode:
            rospy.loginfo("현재 수동 모드입니다. 자동으로 새로운 목적지 선택하지 않습니다.")
            return
        
        if self.occupancy_grid is None or self.global_costmap is None:
            rospy.logwarn("맵이나 비용정보를 아직 받지 못했습니다.")
            return
            
        empty_points = self.find_empty_spaces(self.occupancy_grid)
        if not empty_points:
            rospy.logwarn("적절한 빈 영역을 찾지 못했습니다.")
            return

        forward_points = []
        current_orientation = self.get_robot_orientation()
        try:
            (current_pos, _) = self.tf_listener.lookupTransform('/map', '/base_link', rospy.Time(0))
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            return

        for point in empty_points:
            dx = point[0] - current_pos[0]
            dy = point[1] - current_pos[1]
            angle = math.atan2(dy, dx)
            angle_diff = angle - current_orientation
            while angle_diff > math.pi:
                angle_diff -= 2 * math.pi
            while angle_diff < -math.pi:
                angle_diff += 2 * math.pi
            if abs(angle_diff) <= math.pi/4:
                forward_points.append(point)

        # 전방에 조건에 맞는 점이 없으면 빈 영역 전체에서 임의의 점 선택 (fallback)
        if forward_points:
            selected_point = random.choice(forward_points)
        else:
            rospy.logwarn("전방에 빈 영역이 없습니다. 빈 영역에서 임의의 점을 선택합니다.")
            selected_point = random.choice(empty_points)

        self.nav_points = [selected_point]
        self.visualize_points()
        
        if self.prev_goal:
            dx = selected_point[0] - self.prev_goal.pose.position.x
            dy = selected_point[1] - self.prev_goal.pose.position.y
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
    
    def joy_callback(self, joy_msg):
        # X 버튼(index 2) 또는 Y 버튼(index 3) 눌림 감지
        if joy_msg.buttons[2] or joy_msg.buttons[3]:
            # 이전 모드를 기억하고 토글
            prev_mode = self.auto_mode
            self.auto_mode = not self.auto_mode
            mode = "자동" if self.auto_mode else "수동"
            rospy.loginfo(f"내비게이션 모드가 {mode}(으로) 전환되었습니다.")
            # 만약 수동 모드에서 자동 모드로 전환되었고, 현재 이동 중이 아니라면 새 목표 선택
            if self.auto_mode and not prev_mode and not self.is_moving:
                self.select_and_send_new_goal()
    
    def find_empty_spaces(self, occupancy_grid):
        empty_points = []
        height = occupancy_grid.info.height
        width = occupancy_grid.info.width
        resolution = occupancy_grid.info.resolution
        
        try:
            (current_pos, _) = self.tf_listener.lookupTransform('/map', '/base_link', rospy.Time(0))
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            if self.prev_goal:
                current_pos = (self.prev_goal.pose.position.x, self.prev_goal.pose.position.y, 0)
            else:
                return empty_points

        grid_step = 10  # 격자 간격 (필요시 조정)
        max_distance = 5.0  # 최대 5m 범위 (필요시 확장 가능)
        
        cost_threshold = 100  # 비용 정보 임계치 (장애물과의 안전거리를 위해 필요시 조정)

        for i in range(0, width, grid_step):
            for j in range(0, height, grid_step):
                index = j * width + i
                # 인덱스가 data 범위 내에 있는지 확인
                if index >= len(occupancy_grid.data) or index >= len(self.global_costmap.data):
                    continue
                if occupancy_grid.data[index] == 0 and self.global_costmap.data[index] < cost_threshold:
                    x = i * resolution + occupancy_grid.info.origin.position.x
                    y = j * resolution + occupancy_grid.info.origin.position.y
                    
                    distance = math.sqrt((x - current_pos[0])**2 + (y - current_pos[1])**2)
                    if distance <= max_distance:
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
    
    def send_goal(self, point):
        goal = PoseStamped()
        goal.header.frame_id = "map"
        goal.header.stamp = rospy.Time.now()
        goal.pose.position.x = point[0]
        goal.pose.position.y = point[1]
        orientations = [
            (1.0, 0.0),  
            (0.707, 0.707),  
            (0.0, 1.0),  
            (-0.707, 0.707),
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
