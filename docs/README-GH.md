# 노규헌 

---

## 250113(월)

### Setup Jetson orin nano
- OS 설치 완료
- 네트워크 설정 완료
- 원격 접속 설정 완료
- 개발 환경 구축 진행 중

---

## 250114(화)

### Setup Jetson orin nano
- CUDA 설정 완료
- OpenCV-CUDA 설치 및 테스트 완료
- PyTorch, TorchVision 설치 및 테스트 완료
- YOLOv8 설치 및 테스트 완료

---

## 250115(수)

### 음성 인식 기능 개발
- 기존 계획이였던 Riva를 호환성 문제로 인해 사용 불가해 대체 방안 탐색
- OpenAI의 Whisper 모델 연구 중
- ASR, VAD 연구 중
- Orin Car 하드웨어 조립 진행 중

---

## 250116(목)

### 하드웨어 조립
- 차량 조립 완료(jetson 보드 제외)

### 음성 인식 기능 개발
- Vosk + Whisper 모델 테스트 완료.
    -> Vosk 한국어 모델의 성능 이슈로 인해 사용 불가
- silverVAD + Whisper 모델 테스트 완료.
    - silverVAD를 이용해 음성임을 인식 후 녹음해 Whisper 모델 추론
    - Whisper 모델 테스트에서 인식 동작이 제대로 이뤄지지 않음.

### 자율주행 기능 개발
- 자율주행 기능 개발을 위한 기획 완료
- ROS1 noetic 사용 예정