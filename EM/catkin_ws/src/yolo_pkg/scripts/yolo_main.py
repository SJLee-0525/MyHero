#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import rospy
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError
import threading
import asyncio
from geometry_msgs.msg import PointStamped

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
        self.point_pub = rospy.Publisher("/fall_detection/points", PointStamped, queue_size=1)

        rospy.loginfo("Fall Detection Node 초기화 완료.")

        # 별도의 이벤트 루프 생성 및 실행 (별도 스레드)
        self.loop = asyncio.new_event_loop()
        t = threading.Thread(target=self.loop.run_forever, daemon=True)
        t.start()

    def image_callback(self, msg):
        try:
            # ROS 이미지 메시지를 OpenCV 이미지로 변환 (BGR8)
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")
        except CvBridgeError as e:
            rospy.logerr("CvBridge 변환 에러: %s", e)
            return

        # 기존 asyncio.run 대신, run_coroutine_threadsafe를 이용하여 지속적인 이벤트 루프에 등록
        future = asyncio.run_coroutine_threadsafe(self.detector.process_frame(cv_image), self.loop)
        try:
            processed_frame, fall_detected, debug_info, bounding_boxes = future.result(timeout=1.0)
        except Exception as e:
            rospy.logerr("프레임 처리 에러: %s", e)
            return

        try:
            # 처리된 프레임을 ROS 이미지 메시지로 변환 후 퍼블리시
            output_msg = self.bridge.cv2_to_imgmsg(processed_frame, encoding="bgr8")
            self.image_pub.publish(output_msg)
        except CvBridgeError as e:
            rospy.logerr("CvBridge 변환 에러: %s", e)

        # 각 bounding box의 중심 좌표를 계산한 후 PointStamped 메시지로 퍼블리시
        for box in bounding_boxes:
            # box가 (class_id, confidence, x, y, width, height) 형태라고 가정
            center_x = box[2] + box[4] / 2.0
            center_y = box[3] + box[5] / 2.0

            point_msg = PointStamped()
            point_msg.header.stamp = rospy.Time.now()
            point_msg.header.frame_id = "camera_frame"  # 사용 중인 좌표계에 맞게 변경
            point_msg.point.x = center_x
            point_msg.point.y = center_y
            point_msg.point.z = 0.0  # z 값이 필요 없다면 0으로 설정

            self.point_pub.publish(point_msg)

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
