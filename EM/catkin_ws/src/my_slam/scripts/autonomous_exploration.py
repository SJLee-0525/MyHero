#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
import random
import math
import tf2_ros
import tf2_geometry_msgs
from geometry_msgs.msg import PoseStamped, TransformStamped, Pose, Quaternion
from std_msgs.msg import Bool
from nav_msgs.msg import OccupancyGrid
import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal

class AutonomousExplorer:
    def __init__(self):
        rospy.init_node('autonomous_explorer', anonymous=True)
        
        # 맵 데이터 구독
        self.map_data = None
        self.map_sub = rospy.Subscriber('/map', OccupancyGrid, self.map_callback)

        # autonomous 모드 활성화 여부를 subscribe
        self.exploration_sub = rospy.Subscriber('/exploration_enable', Bool, self.exploration_callback)
        
        # 2D Nav Goal 퍼블리셔 (move_base_simple/goal 예시)
        self.goal_pub = rospy.Publisher('/move_base_simple/goal', PoseStamped, queue_size=1)

        self.tf_buffer = tf2_ros.Buffer()
        self.tf_listener = tf2_ros.TransformListener(self.tf_buffer)
        
        self.exploration_enabled = False
        self.timer = rospy.Timer(rospy.Duration(5.0), self.publish_random_goal)

        self.client = actionlib.SimpleActionClient('move_base', MoveBaseAction)
        self.client.wait_for_server()

    def map_callback(self, msg):
        self.map_data = msg

    def exploration_callback(self, msg):
        self.exploration_enabled = msg.data

    def publish_random_goal(self, event):
        if not self.exploration_enabled or self.map_data is None:
            return
        
        # 현재 로봇 위치 추정(base_link -> map)
        try:
            trans = self.tf_buffer.lookup_transform("map", "base_link", rospy.Time(0), rospy.Duration(1.0))
        except Exception:
            rospy.logwarn("TF 변환 실패")
            return
        
        # 무작위 위치 생성 + 장애물 체크 반복
        for _ in range(10):  # 최대 10회 시도
            dist = random.uniform(3.0, 12.0)
            theta = random.uniform(0, 2 * math.pi)
            goal_x = trans.transform.translation.x + dist * math.cos(theta)
            goal_y = trans.transform.translation.y + dist * math.sin(theta)
            
            # 목표 지점 근처 0.1m 반경 내 장애물 여부 확인
            if self.is_location_free(goal_x, goal_y, 0.1):
                # goal 메시지 설정
                goal_msg = PoseStamped()
                goal_msg.header.frame_id = "map"
                goal_msg.header.stamp = rospy.Time.now()
                goal_msg.pose.position.x = goal_x
                goal_msg.pose.position.y = goal_y
                goal_msg.pose.orientation.w = 1.0

                # 퍼블리시
                self.goal_pub.publish(goal_msg)
                rospy.loginfo("무작위 목표 지점: (%.2f, %.2f)" % (goal_x, goal_y))

                # MoveBaseGoal 설정 및 전송
                move_base_goal = MoveBaseGoal()
                move_base_goal.target_pose.header.frame_id = "map"
                move_base_goal.target_pose.pose.position.x = goal_x
                move_base_goal.target_pose.pose.position.y = goal_y
                move_base_goal.target_pose.pose.orientation = Quaternion(0, 0, 0, 1)
                self.client.send_goal(move_base_goal, done_cb=self.goal_done_cb)
                return

        rospy.logwarn("장애물을 피한 무작위 위치를 찾지 못했습니다.")

    def is_location_free(self, x, y, radius):
        """
        OccupancyGrid를 이용해 (x, y) 근처 radius 내 장애물이 있는지 확인
        """
        if not self.map_data:
            return False
        
        map_info = self.map_data.info
        resolution = map_info.resolution
        origin_x = map_info.origin.position.x
        origin_y = map_info.origin.position.y
        width = map_info.width
        height = map_info.height
        data = self.map_data.data
        
        # 중심 좌표에 해당하는 map의 cell index
        center_col = int((x - origin_x) / resolution)
        center_row = int((y - origin_y) / resolution)
        cell_radius = int(radius / resolution)

        # 범위를 넘어가면 out of map
        if not (0 <= center_col < width and 0 <= center_row < height):
            return False
        
        # radius 내 모든 cell을 검사
        for r in range(center_row - cell_radius, center_row + cell_radius + 1):
            for c in range(center_col - cell_radius, center_col + cell_radius + 1):
                dist_sq = (r - center_row)**2 + (c - center_col)**2
                # 원 형태로 검사(반경 이내일 때만 확인)
                if dist_sq <= cell_radius**2:
                    if 0 <= r < height and 0 <= c < width:
                        idx = r * width + c
                        # 0이 아닌 경우: -1(미탐색) 또는 100(장애물) 등
                        if data[idx] != 0:
                            return False
                    else:
                        return False
        return True

    def goal_done_cb(self, state, result):
        if state == 3:  # 3 = Goal reached
            rospy.loginfo("골 도착, 다음 목표를 설정합니다.")
            self.publish_random_goal(None)
        else:
            rospy.logwarn("골 실패 혹은 취소")

if __name__ == '__main__':
    try:
        explorer = AutonomousExplorer()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass