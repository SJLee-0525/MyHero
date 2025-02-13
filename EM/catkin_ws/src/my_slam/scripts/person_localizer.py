#!/usr/bin/env python3

import rospy
import tf2_ros
import tf2_geometry_msgs
from geometry_msgs.msg import PointStamped, Point
from visualization_msgs.msg import Marker

def bbox_callback(msg):
    # 받은 bbox_center 메시지를 PointStamped로 포장 (카메라 좌표계 사용, frame_id 예: "camera_frame")
    point_cam = PointStamped()
    point_cam.header.stamp = rospy.Time.now()
    point_cam.header.frame_id = "camera_frame"
    point_cam.point = msg

    try:
        # tf2를 이용해 camera_frame -> map으로 변환
        point_map = tf_buffer.transform(point_cam, "map", rospy.Duration(1.0))
        publish_marker(point_map.point)
    except Exception as e:
        rospy.logwarn("tf 변환 실패: {}".format(e))

def publish_marker(point):
    marker = Marker()
    marker.header.frame_id = "map"
    marker.header.stamp = rospy.Time.now()
    marker.ns = "person"
    marker.id = 0
    marker.type = Marker.CUBE  # 혹은 사용자가 원하는 모양(CYLINDER 등)
    marker.action = Marker.ADD
    marker.pose.position = point
    marker.pose.orientation.w = 1.0
    marker.scale.x = 0.3
    marker.scale.y = 0.3
    marker.scale.z = 0.3
    marker.color.a = 1.0
    marker.color.r = 1.0
    marker.color.g = 0.0
    marker.color.b = 0.0

    marker_pub.publish(marker)

if __name__ == "__main__":
    rospy.init_node("person_localizer")
    tf_buffer = tf2_ros.Buffer()
    tf_listener = tf2_ros.TransformListener(tf_buffer)

    rospy.Subscriber("/bbox_center", Point, bbox_callback)
    marker_pub = rospy.Publisher("visualization_marker", Marker, queue_size=10)
    rospy.spin()