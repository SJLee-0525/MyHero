#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
from geometry_msgs.msg import Point, Twist
from std_msgs.msg import Bool
import numpy as np

class PersonFollower:
    def __init__(self):
        rospy.init_node('person_follower', anonymous=True)
        
        # 카메라 관련 파라미터
        self.image_width = rospy.get_param('~image_width', 640)
        self.camera_center = self.image_width / 2
        self.deadzone = self.image_width * 0.1  # 중앙 10% 영역은 데드존으로 설정
        
        # 제어 속도 제한
        self.max_angular_speed = rospy.get_param('~max_angular_speed', 1.0)
        self.base_speed = 0.40  # 기본 선속도
        
        # Subscriber와 Publisher 설정
        self.bbox_sub = rospy.Subscriber('/bbox_center', Point, self.bbox_callback)
        self.cmd_vel_pub = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
        
        # 마지막 검출 시간 저장
        self.last_detection_time = rospy.Time.now()
        self.detection_timeout = rospy.Duration(2)
        
        self.tracking_enabled = False
        
        # Subscriber 추가
        self.tracking_enable_sub = rospy.Subscriber('/tracking_enable', Bool, self.tracking_enable_callback)
        
        # 마지막 제어 명령 저장
        self.last_twist = Twist()

    def bbox_callback(self, msg):
        # 트래킹이 비활성화된 상태면 무시
        if not self.tracking_enabled:
            return
            
        self.last_detection_time = rospy.Time.now()
        
        # 중앙으로부터의 오차 계산
        error = msg.x - self.camera_center
        
        # 데드존 체크
        if abs(error) < self.deadzone:
            angular_z = 0.0
        else:
            # 오차에 비례하는 각속도 계산
            # error를 -1 ~ 1 범위로 정규화
            normalized_error = (error - (-self.camera_center)) / (self.camera_center * 2)
            angular_z = normalized_error * self.max_angular_speed * 1.2
            
            # 각속도 제한
            angular_z = np.clip(angular_z, -self.max_angular_speed, self.max_angular_speed)
        
        # 제어 명령 생성
        twist = Twist()
        twist.linear.x = self.base_speed
        twist.angular.z = angular_z
        
        # 마지막 제어 명령 저장 및 발행
        self.last_twist = twist
        self.cmd_vel_pub.publish(twist)

    def tracking_enable_callback(self, msg):
        self.tracking_enabled = msg.data

    def run(self):
        rate = rospy.Rate(10)  # 10Hz
        
        while not rospy.is_shutdown():
            current_time = rospy.Time.now()
            time_since_last_detection = current_time - self.last_detection_time
            
            # 타임아웃 전에는 마지막 제어 명령 유지
            if self.tracking_enabled:
                if time_since_last_detection > self.detection_timeout:
                    # 타임아웃 시 정지
                    stop_twist = Twist()
                    self.cmd_vel_pub.publish(stop_twist)
                else:
                    # 마지막 제어 명령 재발행
                    self.cmd_vel_pub.publish(self.last_twist)
                    
            rate.sleep()

if __name__ == '__main__':
    try:
        follower = PersonFollower()
        follower.run()
    except rospy.ROSInterruptException:
        pass