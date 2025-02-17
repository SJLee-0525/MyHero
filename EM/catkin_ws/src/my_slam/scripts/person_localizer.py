#!/usr/bin/env python3

import rospy
import tf2_ros
import tf2_geometry_msgs
from geometry_msgs.msg import PointStamped, Point, PoseStamped
from visualization_msgs.msg import Marker

def bbox_callback(msg):
    # bbox 중심점을 3D 공간상의 점으로 투영
    point_cam = PointStamped()
    point_cam.header.frame_id = "camera_frame"
    point_cam.point.x = estimated_depth  # LiDAR에서 얻은 거리
    point_cam.point.y = (msg.x - cx) * estimated_depth / fx  # 카메라 내부 파라미터 사용
    point_cam.point.z = 0.0  # 2D LiDAR 평면상

    try:
        # camera_frame -> map 변환
        point_map = tf_buffer.transform(point_cam, "map")
        
        # RViz Marker로 시각화
        marker = Marker()
        marker.header.frame_id = "map"
        marker.type = Marker.CYLINDER
        marker.action = Marker.ADD
        marker.pose.position = point_map.point
        marker.scale.x = 0.3
        marker.scale.y = 0.3
        marker.scale.z = 1.7  # 사람 키 고려
        marker.color.r = 1.0
        marker.color.a = 0.8
        
        marker_pub.publish(marker)
        
        # 2D Nav Goal 메시지 생성 (옵션)
        goal = PoseStamped()
        goal.header.frame_id = "map"
        goal.pose.position = point_map.point
        goal.pose.orientation.w = 1.0
        goal_pub.publish(goal)
        
    except (tf2_ros.LookupException, tf2_ros.ConnectivityException):
        rospy.logwarn("TF 변환 실패")

if __name__ == "__main__":
    rospy.init_node("person_localizer")
    tf_buffer = tf2_ros.Buffer()
    tf_listener = tf2_ros.TransformListener(tf_buffer)

    rospy.Subscriber("/bbox_center", Point, bbox_callback)
    marker_pub = rospy.Publisher("visualization_marker", Marker, queue_size=10)
    goal_pub = rospy.Publisher("move_base_simple/goal", PoseStamped, queue_size=10)
    rospy.spin()