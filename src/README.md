# 차량형 자율주행 로봇 프로젝트

## 프로젝트 개요
LiDAR 센서 기반의 SLAM과 자율주행이 가능한 차량형 로봇 시스템

### 특징
- IMU/엔코더 없이 LiDAR만으로 자율주행
- Hector SLAM을 이용한 실시간 지도 작성
- ROS Navigation Stack 기반 자율주행
- I2C 통신 기반 모터 제어

## 하드웨어 구성
- YDLidar X4
- DC 모터 (PCA9685 I2C 제어)
- 서보 모터 (애커만 조향)

---

## 프로젝트 구성
프로젝트는 다음 ROS 패키지들로 구성되어 있습니다:

1. my_slam
   - Hector SLAM 기반 SLAM 및 Navigation 설정
   - Move Base 파라미터 설정 
   - 자율주행을 위한 costmap, local planner 설정

2. hector_slam
   - LiDAR 기반 SLAM
   - scan matching을 통한 로봇 위치 추정
   - 실시간 지도 생성

3. robot_motor_controller
   - I2C 기반 DC/서보 모터 제어
   - cmd_vel 토픽을 모터 제어 신호로 변환

4. ydlidar_ros_driver
   - YDLidar X4 드라이버
   - laser scan 토픽 발행

---

## 실행 방법
전체 시스템은 단일 launch 파일로 실행됩니다:
```bash
roslaunch my_slam navigation.launch
```

> 이 launch 파일은 다음 노드들을 실행합니다:
>
> Hector SLAM
> YDLidar 드라이버
> Motor Controller
> Move Base
> RViz

RViz에서 2D Nav Goal 선택을 통해 주행이 가능합니다.

---

## 주요 설정
- costmap 장애물 인식 범위: 2.5m
- 후진 기반 recovery behavior
- 차량 크기: 30cm x 16cm
- 최대 선속도: 0.5 m/s
- local costmap clearing 활성화
- DWA Local Planner 사용

## 참고사항
- IMU/엔코더 없이 LiDAR만으로 위치 추정
- 애커만 조향 방식으로 제자리 회전 불가
- Hector SLAM이 위치 추정 담당
- AMCL은 코드에 포함되어 있으나 사용하지 않음

> AMCL은 엔코더/IMU 등 odom 생성용 센서가 필요
> Hector SLAM의 scan matching으로 pseudo odom을 생성할 수 있으나, 맵 저장 시 초기 위치와 자세에 매우 의존적이어서 실제 적용이 어려움


