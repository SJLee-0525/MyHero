#include "robot_motor_controller/motor_controller.h"
#include <iostream>

MotorController::MotorController(ros::NodeHandle &nh) : 
    nh_(nh),
    fgInitsetting(true),
    velCmdUpdateCount(0),
    i2c_dc_(i2c_device_.c_str(), dc_addr_),
    i2c_servo_(i2c_device_.c_str(), servo_addr_),
    pca_dc_(i2c_dc_),
    pca_servo_(i2c_servo_),
    motor_(pca_dc_, 0),
    servo_(pca_servo_),
    target_linear_vel_(0.0),
    target_angular_vel_(0.0),
    current_linear_vel_(0.0),
    current_angular_vel_(0.0)
{
    loadParameters();
    
    servo_channel_ = 0;
    cmd_vel_sub_ = nh_.subscribe("cmd_vel", 1, &MotorController::cmdVelCallback, this);
    control_timer_ = nh_.createTimer(ros::Duration(1.0/control_rate_), 
                                   &MotorController::controlTimerCallback, this);
    ROS_INFO("Motor Controller initialized");
}

MotorController::~MotorController()
{
    motor_.setThrottle(0.0);
    servo_.setAngle(servo_channel_, 0.0);
    ROS_INFO("Motor Stopped safely");
}

void MotorController::cmdVelCallback(const geometry_msgs::Twist::ConstPtr& msg) {
    if(fgInitsetting) {
        velCmdUpdateCount++;
        target_linear_vel_ = static_cast<float>(msg->linear.x);
        target_linear_vel_ = (target_linear_vel_ > MAX_LINEAR_VEL) ? 
                            MAX_LINEAR_VEL : 
                            (target_linear_vel_ < -MAX_LINEAR_VEL) ? 
                            -MAX_LINEAR_VEL : target_linear_vel_;
                            
        target_angular_vel_ = static_cast<float>(msg->angular.z);
        target_angular_vel_ = (target_angular_vel_ > MAX_ANGULAR_VEL) ? 
                             MAX_ANGULAR_VEL : 
                             (target_angular_vel_ < -MAX_ANGULAR_VEL) ? 
                             -MAX_ANGULAR_VEL : target_angular_vel_;
        
        last_cmd_time_ = ros::Time::now();
    }
}

float MotorController::smoothControl(float target, float current, float rate) {
    float diff = target - current;
    if(fabs(diff) < rate) return target;
    return current + (diff > 0 ? rate : -rate);
}

void MotorController::controlTimerCallback(const ros::TimerEvent& event) {
    // Watchdog
    if((ros::Time::now() - last_cmd_time_).toSec() > 0.5) {
        target_linear_vel_ = 0;
        target_angular_vel_ = 0;
    }
    
    // 부드러운 속도 변화
    current_linear_vel_ = smoothControl(target_linear_vel_, current_linear_vel_, ACCEL_LIMIT);
    current_angular_vel_ = smoothControl(target_angular_vel_, current_angular_vel_, ACCEL_LIMIT);
    
    // 모터 제어값 계산
    float throttle = current_linear_vel_ / MAX_LINEAR_VEL;  // -1.0 ~ 1.0
    float angle = current_angular_vel_ * 180.0/M_PI;  // rad to degree
    
    // 실제 모터 제어
    motor_.setThrottle(throttle);
    servo_.setAngle(servo_channel_, angle);
}

void MotorController::loadParameters() {
    ros::NodeHandle pnh("~");
    
    pnh.param<std::string>("i2c_device", i2c_device_, "/dev/i2c-7");
    pnh.param<int>("dc_addr", dc_addr_, 0x40);
    pnh.param<int>("servo_addr", servo_addr_, 0x60);
    pnh.param<float>("max_linear_vel", max_linear_vel_, 1.0);
    pnh.param<float>("max_angular_vel", max_angular_vel_, M_PI/4);
    pnh.param<float>("control_rate", control_rate_, 50.0);
}