#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import yaml
import rospkg

class Config:
    """
    ROS 파라미터와 YAML 파일을 통해 환경 설정을 로드하는 클래스입니다.
    모델 경로, 임계값, 로그 저장 경로, API URL, 디스플레이 크기, 
    스켈레톤 연결 정보, 색상 등 다양한 설정을 제공합니다.
    """
    def __init__(self):
        # rospkg을 이용해 패키지의 루트 경로를 획득합니다.
        rospack = rospkg.RosPack()
        pkg_path = rospack.get_path('yolo_pkg')
        
        # YAML 파라미터 파일 경로 설정
        config_file = os.path.join(pkg_path, 'config', 'yolo_params.yaml')
        try:
            with open(config_file, 'r') as f:
                params = yaml.safe_load(f)
        except Exception as e:
            raise RuntimeError(f"YAML 파라미터 파일 로드 실패: {e}")
        
        # YAML 파일로부터 파라미터 설정 (기본값은 필요에 따라 지정)
        self.model_path = params.get('model_path', 'yolov8n-pose.pt')
        self.confidence_threshold = params.get('confidence_threshold', 0.4)
        # save_dir는 패키지 경로 하위에 지정 (없으면 생성)
        self.save_dir = os.path.join(pkg_path, params.get('save_dir', 'fall_detection_logs'))
        self.api_url = params.get('api_url', 'http://localhost:8000/fall-alert')
        self.display_size = tuple(params.get('display_size', [960, 540]))
        self.skeleton_connections = params.get('skeleton_connections', [
            [0, 1], [0, 2], [1, 3], [2, 4],
            [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],
            [5, 11], [6, 12], [11, 12],
            [11, 13], [13, 15], [12, 14], [14, 16]
        ])
        self.colors = params.get('colors', {
            'skeleton_normal': [0, 255, 0],
            'skeleton_fall': [0, 0, 255],
            'keypoint': [255, 255, 0],
            'text': [255, 255, 255],
            'fall_text': [0, 0, 255],
            'fps_text': [0, 255, 0]
        })
        
        # 로그 저장 디렉토리가 없으면 생성합니다.
        os.makedirs(self.save_dir, exist_ok=True)
