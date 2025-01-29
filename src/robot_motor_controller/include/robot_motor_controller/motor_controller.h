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

public:
    MotorController(ros::NodeHandle &nh);
    ~MotorController();
    void cmdVelCallback(const geometry_msgs::Twist::ConstPtr &msg);
};

#endif // MOTOR_CONTROLLER_H
