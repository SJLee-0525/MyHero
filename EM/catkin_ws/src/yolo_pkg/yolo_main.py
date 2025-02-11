import cv2
import asyncio
from fall_detector import EnhancedFallDetector

async def main():
    detector = EnhancedFallDetector()
    cap = cv2.VideoCapture(0)  # 웹캠 사용. 파일 경로를 넣어 테스트할 수도 있습니다.
    if not cap.isOpened():
        print("카메라 열기 실패!")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("동영상 프레임 읽기 실패!")
            break

        processed_frame, fall_detected, debug_info = await detector.process_frame(frame)

        cv2.imshow("Fall Detection", processed_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    asyncio.run(main())