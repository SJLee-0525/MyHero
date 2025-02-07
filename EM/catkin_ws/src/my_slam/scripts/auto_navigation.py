#!/usr/bin/env python3

import rospy
import math
import random
from nav_msgs.msg import OccupancyGrid
from geometry_msgs.msg import PoseStamped
from visualization_msgs.msg import Marker, MarkerArray
from actionlib_msgs.msg import GoalStatusArray

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
        
    def map_callback(self, occupancy_grid):
        self.occupancy_grid = occupancy_grid
        if not self.nav_points:  # 처음 맵을 받았을 때 첫 목표점 선택
            self.select_and_send_new_goal()
    
    def status_callback(self, status):
        # status가 비어있거나 이동 중이 아니면 리턴
        if not status.status_list or not self.is_moving:
            return
            
        # 가장 최근 상태 확인 (status.status_list의 마지막 요소)
        current_status = status.status_list[-1].status
        
        # 목표 도달(3) 또는 실패(4)한 경우 새로운 목표점 선택
        if current_status in [3, 4]:
            self.is_moving = False
            rospy.sleep(1.0)  # 잠시 대기
            self.select_and_send_new_goal()

    def select_and_send_new_goal(self):
        if self.occupancy_grid is None:
            return
            
        # 새로운 빈 공간들 찾기
        empty_points = self.find_empty_spaces(self.occupancy_grid)
        
        if empty_points:
            # 랜덤하게 하나의 포인트 선택
            selected_point = random.choice(empty_points)
            
            # 시각화
            self.nav_points = [selected_point]
            self.visualize_points()
            
            # 목표점 전송
            self.send_goal(selected_point)
            self.is_moving = True
            rospy.loginfo(f"새로운 목표점 선택: {selected_point}")

    def find_empty_spaces(self, occupancy_grid):
        empty_points = []
        height = occupancy_grid.info.height
        width = occupancy_grid.info.width
        resolution = occupancy_grid.info.resolution
        
        # 격자 간격으로 샘플링 (모든 빈 칸을 검사하지 않고 일정 간격으로)
        grid_step = 20  # 격자 간격 조절
        
        for i in range(0, width, grid_step):
            for j in range(0, height, grid_step):
                if occupancy_grid.data[j * width + i] == 0:  # 빈 공간
                    x = i * resolution + occupancy_grid.info.origin.position.x
                    y = j * resolution + occupancy_grid.info.origin.position.y
                    empty_points.append((x, y))
        
        return self.filter_points(empty_points)
    
    def filter_points(self, points, min_distance=1.0):
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