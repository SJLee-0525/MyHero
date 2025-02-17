#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
import socket
import json
from std_msgs.msg import String, Bool

class SocketClient:
    def __init__(self):
        rospy.init_node('socket_client', anonymous=True)
        
        # 소켓 통신 설정
        self.HOST = rospy.get_param('~server_ip', '70.12.247.214')
        self.PORT = rospy.get_param('~server_port', 1234)
        
        # ROS 퍼블리셔 설정
        self.camera_pub = rospy.Publisher('camera_status', Bool, queue_size=10)
        self.driving_pub = rospy.Publisher('driving_mode', String, queue_size=10)
        self.session_pub = rospy.Publisher('session_id', String, queue_size=10)  # session_id 퍼블리셔 추가
        
        # 현재 세션 ID 저장
        self.current_session_id = None
        
        # 소켓 연결
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.connect_to_server()

    def connect_to_server(self):
        try:
            self.socket.connect((self.HOST, self.PORT))
            rospy.loginfo(f"Connected to server at {self.HOST}:{self.PORT}")
        except Exception as e:
            rospy.logerr(f"Connection failed: {e}")
            return

    def process_message(self, message):
        try:
            data = json.loads(message)
            
            # session_id 처리
            if 'session_id' in data:
                new_session_id = data['session_id']
                if new_session_id != self.current_session_id:
                    self.current_session_id = new_session_id
                    self.session_pub.publish(new_session_id)
                    rospy.loginfo(f"New session ID: {new_session_id}")
            
            # cameraOn 상태 처리
            if 'cameraOn' in data:
                self.camera_pub.publish(data['cameraOn'])
                rospy.loginfo(f"Camera status: {data['cameraOn']}")
            
            # drivingMode 상태 처리
            if 'drivingMode' in data:
                mode = data['drivingMode']
                if mode in ['stop', 'tracking', 'autonomous']:
                    self.driving_pub.publish(mode)
                    rospy.loginfo(f"Driving mode: {mode}")
                else:
                    rospy.logwarn(f"Invalid driving mode received: {mode}")
                    
        except json.JSONDecodeError as e:
            rospy.logerr(f"JSON decode error: {e}")
        except Exception as e:
            rospy.logerr(f"Error processing message: {e}")

    def run(self):
        rate = rospy.Rate(10)  # 10Hz
        
        while not rospy.is_shutdown():
            try:
                # 서버로부터 데이터 수신
                data = self.socket.recv(1024)
                if data:
                    message = data.decode()
                    rospy.loginfo(f"Received raw message: {message}")
                    self.process_message(message)
            except Exception as e:
                rospy.logerr(f"Connection error: {e}")
                break
                
            rate.sleep()

        self.socket.close()

if __name__ == '__main__':
    try:
        client = SocketClient()
        client.run()
    except rospy.ROSInterruptException:
        pass