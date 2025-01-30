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

## 소프트웨어 구성
1. my_slam
   - Hector SLAM
   - Navigation Stack 설정
   - 자율주행 파라미터

2. robot_motor_controller
   - I2C 기반 모터/서보 제어
   - cmd_vel 처리

## 실행 방법
```bash
# 전체 시스템 실행
roslaunch my_slam navigation.launch
```

## 맵 생성 및 자율주행
1. 수동 주행으로 맵 생성
```bash
rosrun teleop_twist_keyboard teleop_twist_keyboard.py
```

2. 자율주행
   - RViz에서 "2D Nav Goal" 지정
   - Navigation Stack이 경로 계획 및 실행

## 주요 설정
- costmap: 장애물 인식 범위 2.5m
- 후진 기반 recovery behavior
- 차량 크기: 30cm x 16cm
- 최대 선속도: 0.5 m/s

## 참고사항
- IMU/엔코더 없이 LiDAR만으로 위치 추정
- 애커만 조향 방식으로 제자리 회전 불가
- Hector SLAM이 위치 추정 담당

