#include "robot_motor_controller/motor_controller.h"
#include <iostream>

MotorController::MotorController(ros::NodeHandle &nh) : nh_(nh),
                                                        i2c_dc_("/dev/i2c-7", 0x40),
                                                        i2c_servo_("/dev/i2c-7", 0x60),
                                                        pca_dc_(i2c_dc_),
                                                        pca_servo_(i2c_servo_),
                                                        motor_(pca_dc_, 0),
                                                        servo_(pca_servo_)
{
    // 파라미터 초기화
    servo_channel_ = 0; // 기본값

    // cmd_vel 구독
    cmd_vel_sub_ = nh_.subscribe("cmd_vel", 1, &MotorController::cmdVelCallback, this);

    // joint_states 발행행
    joint_state_pub_ = nh_.advertise<sensor_msgs::JointState>("joint_states", 1);

    ROS_INFO("Motor Controller initialized");
}

MotorController::~MotorController()
{
    motor_.setThrottle(0.0);
    servo_.setAngle(servo_channel_, 0.0);
    ROS_INFO("Motor Stopped safely");
}

void MotorController::cmdVelCallback(const geometry_msgs::Twist::ConstPtr &msg)
{
    float throttle = msg->linear.x;
    float angle = msg->angular.z * 45.0;

    // 값 제한
    throttle = (throttle > 1.0f) ? 1.0f : (throttle < -1.0f ? -1.0f : throttle);
    angle = (angle > 45.0f) ? 45.0f : (angle < -45.0f ? -45.0f : angle);

    if (std::abs(msg->angular.z) > 0.001)
    {
        servo_.setAngle(servo_channel_, angle);
    }

    if (std::abs(msg->linear.x) > 0.001)
    {
        motor_.setThrottle(throttle);
    }

    // Stop
    if (std::abs(throttle) < 0.0001 && std::abs(angle) < 0.0001)
    {
        motor_.setThrottle(0.0);
        servo_.setAngle(servo_channel_, 0.0);
    }

    // joint states 발행
    publishJointStates(angle, throttle);
}

void MotorController::publishJointStates(float steering_angle, float throttle)
{
    joint_state_msg_.header.stamp = ros::Time::now();
    joint_state_msg_.name = {"steering_joint", "rear_left_wheel_joint", "rear_right_wheel_joint"};
    joint_state_msg_.position = {steering_angle, 0.0, 0.0};
    joint_state_msg_.velocity = {0.0, throttle, throttle};
    joint_state_pub_.publish(joint_state_msg_);
}