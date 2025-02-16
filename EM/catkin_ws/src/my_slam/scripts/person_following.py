#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
from geometry_msgs.msg import Point, Twist
from sensor_msgs.msg import LaserScan
import numpy as np

class PersonFollower:
    def __init__(self):
        rospy.init_node('person_follower', anonymous=True)
        
        # 기존 파라미터
        self.image_width = rospy.get_param('~image_width', 960)
        self.max_angular_speed = rospy.get_param('~max_angular_speed', 1.2)
        self.max_linear_speed = rospy.get_param('~max_linear_speed', 0.6)
        self.min_linear_speed = rospy.get_param('~min_linear_speed', 0.1)
        self.Kp_angular = rospy.get_param('~Kp_angular', 0.003)
        
        # 장애물 회피 파라미터
        self.safety_distance = rospy.get_param('~safety_distance', 0.5)  # 장애물과의 최소 거리
        self.scan_angle_front = rospy.get_param('~scan_angle_front', 60)  # 전방 감지 각도 (도)
        
        # Subscribers와 Publishers
        self.bbox_sub = rospy.Subscriber('/bbox_center', Point, self.bbox_callback)
        self.scan_sub = rospy.Subscriber('/scan', LaserScan, self.scan_callback)
        self.cmd_vel_pub = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
        
        # 상태 변수
        self.last_detection_time = rospy.Time.now()
        self.detection_timeout = rospy.Duration(1.0)
        self.obstacle_detected = False
        self.min_front_distance = float('inf')
        
    def scan_callback(self, scan_msg):
        # 전방 장애물 감지
        angle_min = -self.scan_angle_front / 2.0
        angle_max = self.scan_angle_front / 2.0
        
        # 전방 구간의 인덱스 계산
        angle_increment = scan_msg.angle_increment
        start_idx = int((angle_min - scan_msg.angle_min) / angle_increment)
        end_idx = int((angle_max - scan_msg.angle_min) / angle_increment)
        
        # 전방 최소 거리 계산
        front_ranges = scan_msg.ranges[start_idx:end_idx]
        valid_ranges = [r for r in front_ranges if scan_msg.range_min < r < scan_msg.range_max]
        
        if valid_ranges:
            self.min_front_distance = min(valid_ranges)
            self.obstacle_detected = self.min_front_distance < self.safety_distance
        
    def bbox_callback(self, msg):
        self.last_detection_time = rospy.Time.now()
        
        # 이미지 중앙으로부터의 오차 계산
        error = msg.x - (self.image_width / 2)
        
        # 회전 속도 계산 (P 제어)
        angular_z = -self.Kp_angular * error
        angular_z = np.clip(angular_z, -self.max_angular_speed, self.max_angular_speed)
        
        # 선속도 설정 (장애물 감지 반영)
        normalized_y = msg.y / self.image_width
        base_linear_x = self.max_linear_speed * (1 - normalized_y)
        
        # 장애물이 가까이 있으면 속도 감소 또는 정지
        if self.obstacle_detected:
            # 장애물까지의 거리에 비례하여 속도 감소
            distance_factor = np.clip(self.min_front_distance / self.safety_distance, 0, 1)
            linear_x = base_linear_x * distance_factor
        else:
            linear_x = base_linear_x
            
        linear_x = np.clip(linear_x, self.min_linear_speed, self.max_linear_speed)
        
        # 장애물이 매우 가까우면 정지
        if self.min_front_distance < self.safety_distance * 0.5:
            linear_x = 0
        
        # Twist 메시지 생성 및 발행
        twist = Twist()
        twist.linear.x = linear_x
        twist.angular.z = angular_z
        self.cmd_vel_pub.publish(twist)
        
    def run(self):
        rate = rospy.Rate(10)
        
        while not rospy.is_shutdown():
            if (rospy.Time.now() - self.last_detection_time) > self.detection_timeout:
                twist = Twist()
                self.cmd_vel_pub.publish(twist)
            rate.sleep()

if __name__ == '__main__':
    try:
        follower = PersonFollower()
        follower.run()
    except rospy.ROSInterruptException:
        pass