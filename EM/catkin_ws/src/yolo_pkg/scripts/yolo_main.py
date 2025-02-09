#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError
import asyncio

# fall_detection 모듈에서 EnhancedFallDetector를 임포트합니다.
from yolo_pkg.fall_detection import EnhancedFallDetector

class FallDetectionNode:
    def __init__(self):
        rospy.init_node("fall_detection_node", anonymous=True)
        self.bridge = CvBridge()

        # 낙상 감지기 초기화 (내부에서 YOLO 모델 및 관련 설정 로드)
        self.detector = EnhancedFallDetector()

        # 이미지 입력/출력 토픽 설정 (필요에 따라 이름 수정)
        self.image_sub = rospy.Subscriber("/camera/image_raw", Image, self.image_callback, queue_size=1)
        self.image_pub = rospy.Publisher("/fall_detection/output", Image, queue_size=1)

        rospy.loginfo("Fall Detection Node 초기화 완료.")

    def image_callback(self, msg):
        try:
            # ROS 이미지 메시지를 OpenCV 이미지로 변환 (BGR8)
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")
        except CvBridgeError as e:
            rospy.logerr("CvBridge 변환 에러: %s", e)
            return

        # 비동기 처리 함수 호출 (매 프레임마다 새 이벤트 루프를 생성)
        try:
            processed_frame, fall_detected, debug_info = asyncio.run(self.detector.process_frame(cv_image))
        except Exception as e:
            rospy.logerr("프레임 처리 에러: %s", e)
            return

        try:
            # 처리된 프레임을 ROS 이미지 메시지로 변환 후 퍼블리시
            output_msg = self.bridge.cv2_to_imgmsg(processed_frame, encoding="bgr8")
            self.image_pub.publish(output_msg)
        except CvBridgeError as e:
            rospy.logerr("CvBridge 변환 에러: %s", e)

        if fall_detected:
            rospy.loginfo("낙상 감지됨!")

    def spin(self):
        rospy.spin()


if __name__ == "__main__":
    try:
        node = FallDetectionNode()
        node.spin()
    except rospy.ROSInterruptException:
        pass
