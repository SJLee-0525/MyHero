# YOLO PKG
---

**CvBridge**는 ROS 이미지 메시지를 OpenCV 이미지로 (그리고 반대로) 변환해주는 패키지. 

1. **패키지 종속성 추가:**  
   - **package.xml** 파일에 `<depend>cv_bridge</depend>` (또는 `<build_depend>cv_bridge</build_depend>`와 `<exec_depend>cv_bridge</exec_depend>`)를 추가하여 cv_bridge 패키지를 의존성 목록에 포함시킵니다.
   
2. **CMakeLists.txt 설정:**  
   - `find_package(catkin REQUIRED COMPONENTS cv_bridge ...)`와 같이 cv_bridge를 포함시켜 빌드할 수 있도록 합니다.
   
3. **설치:**  
   - ROS Noetic을 사용 중이라면, 보통 cv_bridge는 이미 설치되어 있지만 만약 없다면 터미널에서 아래와 같이 설치합니다:
     ```bash
     sudo apt-get install ros-noetic-cv-bridge
     ```


```
yolo_pkg/
├── CMakeLists.txt           # 빌드 설정
├── package.xml              # 패키지 메타데이터 및 의존성
├── README.md                # 패키지 설명 문서
├── config/
│   └── yolo_params.yaml     # YOLO 및 낙상 감지 관련 파라미터 파일
├── launch/
│   └── yolo_pose.launch     # 실제 노드 실행을 위한 launch 파일
├── scripts/
│   └── yolo_main.py         # ROS 엔트리 포인트 (노드 실행 스크립트)
└── src/
    └── yolo_pkg/            # Python 모듈 패키지
        ├── __init__.py      # 패키지 초기화 (모듈 공개)
        ├── config.py        # 설정 및 파라미터 로드 모듈
        ├── detector.py      # YOLO 모델 추론 및 키포인트 검출 모듈
        └── fall_detection.py# 낙상 감지 및 포즈 분석 모듈

```