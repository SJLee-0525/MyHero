cmake_minimum_required(VERSION 3.0.2)
project(backoff_recovery)

find_package(catkin REQUIRED COMPONENTS
  base_local_planner
  cmake_modules
  costmap_2d
  nav_core
  pluginlib
  roscpp
  tf2
  tf2_geometry_msgs
  tf2_ros
)

include_directories(
  include
  ${catkin_INCLUDE_DIRS}
)

catkin_package(
  INCLUDE_DIRS include
  LIBRARIES rotate_recovery
  CATKIN_DEPENDS
    costmap_2d
    nav_core
    pluginlib
    roscpp
    tf2
    tf2_ros
)


add_library(backoff_recovery src/backoff_recovery.cpp)
add_dependencies(backoff_recovery ${${PROJECT_NAME}_EXPORTED_TARGETS} ${catkin_EXPORTED_TARGETS})
target_link_libraries(backoff_recovery ${catkin_LIBRARIES})


install(TARGETS backoff_recovery
       ARCHIVE DESTINATION ${CATKIN_PACKAGE_LIB_DESTINATION}
       LIBRARY DESTINATION ${CATKIN_PACKAGE_LIB_DESTINATION}
       RUNTIME DESTINATION ${CATKIN_GLOBAL_BIN_DESTINATION}
       )

install(DIRECTORY include/${PROJECT_NAME}/
  DESTINATION ${CATKIN_PACKAGE_INCLUDE_DESTINATION}
  FILES_MATCHING PATTERN "*.h"
)

install(FILES backoff_plugin.xml
    DESTINATION ${CATKIN_PACKAGE_SHARE_DESTINATION}
)