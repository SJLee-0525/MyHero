#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
from geometry_msgs.msg import Point, Twist
import numpy as np

class PersonFollower:
    def __init__(self):
        rospy.init_node('person_follower', anonymous=True)
        
        # 파라미터 설정
        self.image_width = rospy.get_param('~image_width', 960)  # YOLO 설정과 일치
        self.max_angular_speed = rospy.get_param('~max_angular_speed', 1.2)  # DWA planner와 일치
        self.max_linear_speed = rospy.get_param('~max_linear_speed', 0.6)   # DWA planner와 일치
        self.min_linear_speed = rospy.get_param('~min_linear_speed', 0.1)   # DWA planner와 일치
        self.Kp_angular = rospy.get_param('~Kp_angular', 0.003)  # 넓어진 이미지에 맞춰 조정
        
        # Subscriber와 Publisher 설정
        self.bbox_sub = rospy.Subscriber('/bbox_center', Point, self.bbox_callback)
        self.cmd_vel_pub = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
        
        # 마지막 검출 시간 저장
        self.last_detection_time = rospy.Time.now()
        self.detection_timeout = rospy.Duration(1.0)  # 1초 동안 검출이 없으면 정지
        
    def bbox_callback(self, msg):
        self.last_detection_time = rospy.Time.now()
        
        # 이미지 중앙으로부터의 오차 계산
        error = msg.x - (self.image_width / 2)
        
        # 회전 속도 계산 (P 제어)
        angular_z = -self.Kp_angular * error
        angular_z = np.clip(angular_z, -self.max_angular_speed, self.max_angular_speed)
        
        # 선속도 설정 (y 좌표를 기반으로 거리 추정)
        # y 좌표가 클수록 (아래쪽) 가까이 있다는 의미
        normalized_y = msg.y / self.image_width  # 정규화된 y 값
        linear_x = self.max_linear_speed * (1 - normalized_y)
        linear_x = np.clip(linear_x, self.min_linear_speed, self.max_linear_speed)
        
        # Twist 메시지 생성 및 발행
        twist = Twist()
        twist.linear.x = linear_x
        twist.angular.z = angular_z
        self.cmd_vel_pub.publish(twist)
        
    def run(self):
        rate = rospy.Rate(10)  # 10Hz
        
        while not rospy.is_shutdown():
            # 일정 시간 동안 검출이 없으면 로봇 정지
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