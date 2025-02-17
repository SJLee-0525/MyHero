#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
from geometry_msgs.msg import Point, Twist
from sensor_msgs.msg import LaserScan
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
        
        # 장애물 감지 관련 변수 초기화
        self.obstacle_detected = False
        self.latest_scan = None
        
        # 카메라와 LiDAR 파라미터
        self.camera_fov = rospy.get_param('~camera_fov', 60)  # 카메라 화각 (도)
        self.camera_fov_rad = np.radians(self.camera_fov)
        
        # 차량 키네매틱 파라미터
        self.wheelbase = rospy.get_param('~wheelbase', 0.2)  # 축거
        self.min_turn_radius = rospy.get_param('~min_turn_radius', 0.4)  # 최소 회전반경
        self.target_distance = rospy.get_param('~target_distance', 1.0)  # 목표 추종 거리
        
        # 제어 파라미터
        self.Kp_angle = rospy.get_param('~Kp_angle', 1.0)  # 각도 제어 게인
        self.Kp_dist = rospy.get_param('~Kp_dist', 0.5)   # 거리 제어 게인
        
        # 상태 변수 추가
        self.target_angle = 0.0
        self.current_distance = float('inf')
        
        # Subscriber와 Publisher 설정
        self.bbox_sub = rospy.Subscriber('/bbox_center', Point, self.bbox_callback)
        self.cmd_vel_pub = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
        
        # 마지막 검출 시간 저장
        self.last_detection_time = rospy.Time.now()
        self.detection_timeout = rospy.Duration(1.0)  # 1초 동안 검출이 없으면 정지

        # LiDAR scan 관련 변수 초기화
        self.latest_scan = None
        self.scan_sub = rospy.Subscriber('/scan', LaserScan, self.scan_callback)
        
        # 안전 거리 관련 파라미터 추가
        self.safety_distance = rospy.get_param('~safety_distance', 0.5)  # 안전 거리 (미터)
        self.min_front_distance = float('inf')  # 전방 최소 거리 초기화
        
    def get_target_angle_and_distance(self, bbox_x, scan_msg):
        # 이미지 x 좌표를 라디안으로 변환
        normalized_x = (bbox_x - self.image_width/2) / (self.image_width/2)
        target_angle = normalized_x * (self.camera_fov_rad/2)
        
        # LiDAR 데이터에서 해당 각도의 거리 추출
        scan_idx = int((target_angle - scan_msg.angle_min) / scan_msg.angle_increment)
        if 0 <= scan_idx < len(scan_msg.ranges):
            distance = scan_msg.ranges[scan_idx]
            if scan_msg.range_min < distance < scan_msg.range_max:
                return target_angle, distance
        return target_angle, float('inf')

    def calculate_control(self, target_angle, current_distance):
        # 애커만 조향 기반 각속도 계산
        max_steer_angle = np.arctan(self.wheelbase / self.min_turn_radius)
        desired_steer = np.clip(target_angle, -max_steer_angle, max_steer_angle)
        angular_z = self.Kp_angle * desired_steer
        
        # 거리 기반 선속도 계산
        distance_error = current_distance - self.target_distance
        linear_x = self.Kp_dist * distance_error
        
        return linear_x, angular_z

    def bbox_callback(self, msg):
        self.last_detection_time = rospy.Time.now()
        
        # 현재 LiDAR 데이터로 목표물의 각도와 거리 계산
        target_angle, current_distance = self.get_target_angle_and_distance(msg.x, self.latest_scan)
        
        # 제어값 계산
        base_linear_x, angular_z = self.calculate_control(target_angle, current_distance)
        
        # 장애물 회피 로직 적용
        if self.obstacle_detected:
            distance_factor = np.clip(self.min_front_distance / self.safety_distance, 0, 1)
            linear_x = base_linear_x * distance_factor
        else:
            linear_x = base_linear_x
            
        # 속도 제한
        linear_x = np.clip(linear_x, self.min_linear_speed, self.max_linear_speed)
        angular_z = np.clip(angular_z, -self.max_angular_speed, self.max_angular_speed)
        
        # 안전 정지 조건
        if self.min_front_distance < self.safety_distance * 0.5:
            linear_x = 0
        
        # 제어 명령 발행
        twist = Twist()
        twist.linear.x = linear_x
        twist.angular.z = angular_z
        self.cmd_vel_pub.publish(twist)
        
    def scan_callback(self, msg):
        self.latest_scan = msg
        # 전방 90도(-45도~+45도) 내의 최소 거리 계산
        front_angles = np.arange(len(msg.ranges))[len(msg.ranges)//4:3*len(msg.ranges)//4]
        front_ranges = np.array(msg.ranges)[front_angles]
        valid_ranges = front_ranges[np.isfinite(front_ranges)]
        self.min_front_distance = np.min(valid_ranges) if len(valid_ranges) > 0 else float('inf')

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