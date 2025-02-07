#!/usr/bin/env python
# -*- coding: utf-8 -*-

import rospy
import sys, select, termios, tty
from geometry_msgs.msg import Twist

# 키 안내 메시지
msg = """
Control Your RC Car!
---------------------------
Moving around:
   w
a  s  d
   x

w : 전진
s : 감속 (정지 또는 후진)
x : 후진
a : 좌회전
d : 우회전
space : 긴급 정지
q : 끝내기
---------------------------
CTRL-C to quit
"""

# 선속도, 각속도 증감 단위
LIN_SPD_STEP = 0.05
ANG_SPD_STEP = 0.45

# teleop_wasd.py의 getKey() 함수 수정
def getKey():
    old_settings = termios.tcgetattr(sys.stdin)
    try:
        tty.setraw(sys.stdin.fileno())
        key = sys.stdin.read(1)
    finally:
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, old_settings)
    return key

if __name__ == "__main__":

    settings = termios.tcgetattr(sys.stdin)

    rospy.init_node('teleop_wasd')
    pub = rospy.Publisher('cmd_vel', Twist, queue_size=1)

    linear_speed = 0.0
    angular_speed = 0.0

    try:
        print(msg)
        while not rospy.is_shutdown():
            key = getKey()

            if key == 'w':
                linear_speed += LIN_SPD_STEP
            elif key == 'x':
                linear_speed -= LIN_SPD_STEP
            elif key == 's':
                # 감속(속도를 0에 가깝게 만든다거나, 후진을 조금씩 하도록 처리할 수도 있음)
                if linear_speed > 0:
                    linear_speed -= LIN_SPD_STEP
                else:
                    linear_speed = 0.0
            elif key == 'a':
                angular_speed -= ANG_SPD_STEP
            elif key == 'd':
                angular_speed += ANG_SPD_STEP
            elif key == ' ':
                # 긴급 정지
                linear_speed = 0.0
                angular_speed = 0.0
                rospy.loginfo("Emergency Stop!")
            elif key == 'q':
                rospy.signal_shutdown("Shutdown reason")  # 노드를 우아하게 종료
            else:
                # 아무 입력이 없으면 속도 유지 or 서서히 감속 등 원하는 로직
                # 여기서는 아무것도 하지 않음
                pass
            
            # 선속도, 각속도 제한
            # motor_controller.cpp에서 throttle(-1.0 ~ 1.0) 범위 사용
            linear_speed = max(-1.0, min(1.0, linear_speed))
            angular_speed = max(-2.0, min(2.0, angular_speed))  # 회전은 적절히 범위 설정

            # Twist 메시지 구성
            twist = Twist()
            twist.linear.x = linear_speed
            twist.angular.z = angular_speed

            pub.publish(twist)

    except Exception as e:
        print(e)

    finally:
        # 노드 종료 시 속도 0
        twist = Twist()
        pub.publish(twist)
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, settings)

