#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import cv2
import torch
import numpy as np
import warnings
from ultralytics import YOLO

# config.py에 정의한 Config 클래스를 import 합니다.
from yolo_pkg.config import Config

warnings.filterwarnings('ignore')

class YOLOPoseDetector:
    """
    YOLO Pose Detector 클래스

    YOLO 모델을 로드하고 입력 프레임에 대해 추론을 실행하여
    사람의 키포인트 데이터를 추출합니다.
    """
    def __init__(self):
        # Config를 통해 환경 설정을 로드합니다.
        self.config = Config()
        try:
            # 설정에 지정된 모델 경로로부터 YOLO 모델을 로드합니다.
            self.model = YOLO(self.config.model_path)
            # 사용 가능한 디바이스 선택 (GPU 우선)
            self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
            self.model.to(self.device)
            print(f"YOLO 모델 로드 완료 (Device: {self.device})")
        except Exception as e:
            print(f"YOLO 모델 로드 실패: {e}")
            raise

    def detect(self, frame):
        """
        입력 프레임에 대해 YOLO 추론을 수행합니다.
        
        Args:
            frame (numpy.ndarray): 입력 이미지 프레임.
        
        Returns:
            results: YOLO 모델 추론 결과 객체.
        """
        try:
            results = self.model(frame, verbose=False)
            return results
        except Exception as e:
            print(f"YOLO 추론 중 오류 발생: {e}")
            return None

    def extract_keypoints(self, results):
        """
        YOLO 추론 결과로부터 사람별 키포인트 데이터를 추출합니다.
        
        Args:
            results: YOLO 모델 추론 결과 객체.
        
        Returns:
            keypoints_list (list): 각 사람의 키포인트 배열을 담은 리스트.
        """
        keypoints_list = []
        if results is None:
            return keypoints_list

        try:
            # results 내부의 각 결과(result)에 대해
            for result in results:
                if result.keypoints is None:
                    continue

                # 각 사람에 대한 키포인트 데이터 추출
                for person_keypoints in result.keypoints.data:
                    # 만약 keypoints가 torch.Tensor 형태이면 numpy 배열로 변환
                    if torch.is_tensor(person_keypoints):
                        person_keypoints = person_keypoints.cpu().numpy()
                    keypoints_list.append(person_keypoints)
        except Exception as e:
            print(f"키포인트 추출 중 오류: {e}")
        return keypoints_list

# -------------------------------
# 아래는 detector.py의 독립 테스트용 코드입니다.
# 실제 ROS 노드에서는 이 모듈을 임포트하여 사용하면 됩니다.
# -------------------------------
if __name__ == '__main__':
    # YOLOPoseDetector 기능을 간단히 테스트하는 코드
    detector = YOLOPoseDetector()
    cap = cv2.VideoCapture(0)  # 웹캠 사용 (혹은 이미지 파일 경로 지정 가능)
    if not cap.isOpened():
        print("비디오 캡처를 열 수 없습니다.")
        exit(1)
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("프레임 읽기 실패")
            break
        
        # YOLO 모델로 추론 실행
        results = detector.detect(frame)
        # 추론 결과에서 키포인트 추출
        keypoints_list = detector.extract_keypoints(results)
        
        # 간단한 시각화를 위해 각 사람의 키포인트 개수를 프레임에 표시
        for idx, kps in enumerate(keypoints_list):
            cv2.putText(frame,
                        f"Person {idx}: {kps.shape[0]} keypoints",
                        (10, 30 + idx * 30),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.6,
                        (0, 255, 0),
                        2)
        
        cv2.imshow("YOLO Pose Detector Test", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
