#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
from std_msgs.msg import String, Bool
from geometry_msgs.msg import Twist

class DrivingModeManager:
    def __init__(self):
        rospy.init_node('driving_mode_manager', anonymous=True)
        
        # 현재 주행 모드
        self.current_mode = "stop"
        
        # Subscribers
        self.mode_sub = rospy.Subscriber('driving_mode', String, self.mode_callback)
        
        # Publishers
        self.cmd_vel_pub = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
        self.exploration_enable_pub = rospy.Publisher('/exploration_enable', Bool, queue_size=1)
        self.tracking_enable_pub = rospy.Publisher('/tracking_enable', Bool, queue_size=1)
        
    def mode_callback(self, msg):
        new_mode = msg.data
        if new_mode != self.current_mode:
            rospy.loginfo(f"주행 모드 변경: {self.current_mode} -> {new_mode}")
            self.handle_mode_change(new_mode)
            self.current_mode = new_mode
    
    def handle_mode_change(self, new_mode):
        # 모든 모드 비활성화
        self.exploration_enable_pub.publish(False)
        self.tracking_enable_pub.publish(False)
        
        # 로봇 정지
        stop_cmd = Twist()
        self.cmd_vel_pub.publish(stop_cmd)
        
        # 새로운 모드 활성화
        if new_mode == "autonomous":
            rospy.sleep(0.5)  # 안정화를 위한 대기
            self.exploration_enable_pub.publish(True)
        elif new_mode == "tracking":
            rospy.sleep(0.5)  # 안정화를 위한 대기
            self.tracking_enable_pub.publish(True)
        # "stop" 모드는 이미 처리됨

if __name__ == '__main__':
    try:
        manager = DrivingModeManager()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass