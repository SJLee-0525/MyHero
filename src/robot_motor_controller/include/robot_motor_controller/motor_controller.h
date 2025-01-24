#ifndef MOTOR_CONTROLLER_H
#define MOTOR_CONTROLLER_H

#include <ros/ros.h>
#include <geometry_msgs/Twist.h>
#include "DC_motor.hpp"
#include "Servo_motor.hpp"
#include "PCA9685.hpp"
#include "i2c.hpp"
#include <sensor_msgs/JointState.h>

class MotorController
{
private:
    ros::NodeHandle nh_;
    ros::Subscriber cmd_vel_sub_;
    ros::Publisher joint_state_pub_;

    // I2C 디바이스
    I2CDevice i2c_dc_;
    I2CDevice i2c_servo_;

    // PCA9685 컨트롤러
    PCA9685 pca_dc_;
    PCA9685 pca_servo_;

    // 모터 컨트롤러
    PWMThrottleHat motor_;
    Servo servo_;

    // ROS 파라미터
    int servo_channel_;

    // ================ RViz URDF용 ===========================
    // 바퀴 회전각 누적값(시각화용)
    float fl_wheel_angle_; // front_left
    float fr_wheel_angle_; // front_right
    float rl_wheel_angle_; // rear_left
    float rr_wheel_angle_; // rear_right

    // 가장 최근에 업데이트된 시간 (delta time 계산용)
    ros::Time last_update_time_;

    // 바퀴 반지름 (m 단위) - URDF상 0.035
    float wheel_radius_;

    // throttle=1.0일 때의 최대 선속도 (m/s)
    float max_speed_mps_;

    // JointState 메시지
    sensor_msgs::JointState joint_state_msg_;
    // =========================================================

public:
    MotorController(ros::NodeHandle &nh);
    ~MotorController(); // 소멸자 추가
    void cmdVelCallback(const geometry_msgs::Twist::ConstPtr &msg);
    void publishJointStates(float steering_angle_deg, float throttle, double dt);
};

#endif // MOTOR_CONTROLLER_H
