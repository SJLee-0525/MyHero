#ifndef MOTOR_CONTROLLER_H
#define MOTOR_CONTROLLER_H

#include <ros/ros.h>
#include <geometry_msgs/Twist.h>
#include "DC_motor.hpp"
#include "Servo_motor.hpp"
#include "PCA9685.hpp"
#include "i2c.hpp"
#include <sensor_msgs/JointState.h>
#include <algorithm>

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

    // 제어 관련 변수
    float target_linear_vel_;
    float target_angular_vel_;
    float current_linear_vel_;
    float current_angular_vel_;
    
    // 제어 파라미터
    const float MAX_LINEAR_VEL = 0.5f;  // m/s
    const float MAX_ANGULAR_VEL = M_PI/4.0f;  // rad/s
    const float CONTROL_RATE = 50.0f;  // Hz
    const float ACCEL_LIMIT = 0.1f;  // 가속도 제한
    
    // 설정 파라미터
    std::string i2c_device_;
    int dc_addr_;
    int servo_addr_;
    float max_linear_vel_;
    float max_angular_vel_;
    float control_rate_;
    
    bool fgInitsetting;
    int velCmdUpdateCount;
    
    // ROS 관련 변수 추가
    ros::Timer control_timer_;
    ros::Time last_cmd_time_;
    
    void controlTimerCallback(const ros::TimerEvent& event);
    float smoothControl(float target, float current, float rate);
    void loadParameters();

public:
    MotorController(ros::NodeHandle &nh);
    ~MotorController();
    void cmdVelCallback(const geometry_msgs::Twist::ConstPtr &msg);
};

#endif // MOTOR_CONTROLLER_H
