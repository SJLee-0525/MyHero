# Hector SLAM + Navigation

---

## How to Use
```
catkin_make
```

```
roslaunch my_slam navigation.launch
```

## About config files

### `costmap_common_params.yaml`

로봇의 기본적인 물리적 특성과 안전 설정을 정의합니다. 

로봇의 크기, 모양, 센서 설정, 그리고 장애물과의 안전 거리 등 모든 costmap이 공통으로 사용하는 기본 파라미터들이 포함됩니다.

### `local_costmap_params.yaml`

로봇 주변의 지역 경로 계획을 위한 설정을 담당합니다. 

실시간으로 업데이트되는 로봇 주변의 작은 영역에 대한 지도를 관리하며, 주로 즉각적인 장애물 회피에 사용됩니다.

### `global_costmap_params.yaml`

전체 환경에 대한 경로 계획을 위한 설정을 관리합니다. 

SLAM으로 생성된 전체 지도를 기반으로 작동하며, 출발지에서 목적지까지의 전반적인 경로를 계획하는 데 사용됩니다.

### `base_local_planner_params.yaml`

로봇의 실제 움직임을 제어하는 파라미터들을 포함합니다. 

최대 속도, 가속도, 목표 도달 허용 오차 등을 설정하며, 계획된 경로를 따라 로봇이 어떻게 움직일지를 결정합니다.

