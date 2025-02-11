#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import cv2
import rospy
import asyncio
from yolo_pkg.fall_detector import EnhancedFallDetector

async def main():
    rospy.init_node('yolo_detection', anonymous=True)
    detector = EnhancedFallDetector()
    cap = cv2.VideoCapture(0)  # 웹캠 사용. 파일 경로를 넣어 테스트할 수도 있습니다.
    if not cap.isOpened():
        print("카메라 열기 실패!")
        return

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            print("동영상 프레임 읽기 실패!")
            break

        if frame_count % 5 == 0:
            processed_frame, fall_detected, debug_info = await detector.process_frame(frame)
        else:
            processed_frame = frame

        frame_count += 1

        cv2.imshow("Fall Detection", processed_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except rospy.ROSInterruptException:
        pass