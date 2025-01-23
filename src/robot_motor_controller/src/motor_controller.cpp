#include "robot_motor_controller/motor_controller.h"

MotorController::MotorController(ros::NodeHandle& nh) : 
    nh_(nh),
    i2c_dc_("/dev/i2c-7", 0x40),
    i2c_servo_("/dev/i2c-7", 0x60),
    pca_dc_(i2c_dc_),
    pca_servo_(i2c_servo_),
    motor_(pca_dc_, 0),
    servo_(pca_servo_)
{
    // 파라미터 초기화
    servo_channel_ = 0;  // 기본값
    
    // cmd_vel 구독
    cmd_vel_sub_ = nh_.subscribe("cmd_vel", 1, &MotorController::cmdVelCallback, this);
    
    ROS_INFO("Motor Controller initialized");
}

void MotorController::cmdVelCallback(const geometry_msgs::Twist::ConstPtr& msg)
{
    // linear.x를 throttle로 변환 (-1.0 ~ 1.0)
    float throttle = msg->linear.x;  // 필요하다면 스케일링 가능
    
    // angular.z를 angle로 변환 (-45 ~ 45)
    float angle = msg->angular.z * (45.0 / M_PI);  // rad/s를 degree로 변환
    
    // 값 범위 제한
    throttle = std::max(-1.0f, std::min(1.0f, throttle));
    angle = std::max(-45.0f, std::min(45.0f, angle));
    
    // 모터 제어
    motor_.setThrottle(throttle);
    servo_.setAngle(servo_channel_, angle);
}
