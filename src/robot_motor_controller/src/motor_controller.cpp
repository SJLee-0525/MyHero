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

    // 초기값
    fl_wheel_angle_ = 0.0f;
    fr_wheel_angle_ = 0.0f;
    rl_wheel_angle_ = 0.0f;
    rr_wheel_angle_ = 0.0f;

    // 바퀴 반지름 0.035 m
    wheel_radius_ = 0.035f;
    // throttle=1.0 일 때 1.0 m/s 로 달린다고 가정
    max_speed_mps_ = 1.0f;

    last_update_time_ = ros::Time::now();

    // 구독/퍼블리시 설정
    cmd_vel_sub_ = nh_.subscribe("cmd_vel", 1, &MotorController::cmdVelCallback, this);
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

    // 현재 시간
    ros::Time now = ros::Time::now();
    double dt = (now - last_update_time_).toSec();
    last_update_time_ = now;

    // **회전각 시뮬레이션** 갱신 & JointState 퍼블리시
    publishJointStates(angle, throttle, dt);
}

void MotorController::publishJointStates(float steering_angle_deg, float throttle, double dt)
{
    // 1) 조향각 (deg -> rad)
    float steering_angle_rad = steering_angle_deg * (M_PI / 180.0f);

    // 2) 선속도 (m/s) = throttle * max_speed
    float linear_speed = throttle * max_speed_mps_;

    // 3) dt 초 동안 이동거리
    float distance = linear_speed * dt; // m

    // 4) 바퀴 1바퀴 회전량 (rad) = 이동거리 / wheel_radius
    //    => 누적 각도에 더함
    float wheel_angle_inc = 0.0f;
    if (wheel_radius_ > 1e-6)
        wheel_angle_inc = distance / wheel_radius_;

    fl_wheel_angle_ += wheel_angle_inc;
    fr_wheel_angle_ += wheel_angle_inc;
    rl_wheel_angle_ += wheel_angle_inc;
    rr_wheel_angle_ += wheel_angle_inc;

    // 5) joint_state_msg 작성
    joint_state_msg_.header.stamp = ros::Time::now();
    joint_state_msg_.name = {
        "steering_joint",
        "front_left_wheel_joint",
        "front_right_wheel_joint",
        "rear_left_wheel_joint",
        "rear_right_wheel_joint"};
    joint_state_msg_.position.resize(5);
    joint_state_msg_.velocity.resize(5);

    // steering_joint -> 조향각
    joint_state_msg_.position[0] = steering_angle_rad;
    joint_state_msg_.velocity[0] = 0.0;

    // front_left_wheel_joint
    joint_state_msg_.position[1] = fl_wheel_angle_;
    // 속도는 rad/s = (distance / r) / dt
    joint_state_msg_.velocity[1] = (dt > 0.0) ? (wheel_angle_inc / dt) : 0.0;

    // front_right_wheel_joint
    joint_state_msg_.position[2] = fr_wheel_angle_;
    joint_state_msg_.velocity[2] = joint_state_msg_.velocity[1];

    // rear_left_wheel_joint
    joint_state_msg_.position[3] = rl_wheel_angle_;
    joint_state_msg_.velocity[3] = joint_state_msg_.velocity[1];

    // rear_right_wheel_joint
    joint_state_msg_.position[4] = rr_wheel_angle_;
    joint_state_msg_.velocity[4] = joint_state_msg_.velocity[1];

    // 퍼블리시
    joint_state_pub_.publish(joint_state_msg_);
}
