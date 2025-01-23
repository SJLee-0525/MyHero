#include "robot_motor_controller/motor_controller.h"

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
    float target_angle;

    if (std::abs(msg->linear.x) < 0.001)
    { // 제자리 회전
        target_angle = (msg->angular.z > 0) ? 45.0 : -45.0;
    }
    else
    { // 이동 중 회전
        float turning_radius = std::abs(msg->linear.x / msg->angular.z);
        if (turning_radius < WHEELBASE)
        { // 매우 급격한 회전 필요
            target_angle = (msg->angular.z > 0) ? 45.0 : -45.0;
        }
        else
        {
            target_angle = std::atan2(WHEELBASE, turning_radius) * 180.0 / M_PI;
            if (msg->linear.x < 0)
                target_angle = -target_angle; // 후진 시 방향 전환
        }
    }

    throttle = std::max(-1.0f, std::min(1.0f, throttle));
    target_angle = std::max(-45.0f, std::min(45.0f, target_angle));

    motor_.setThrottle(throttle);
    servo_.setAngle(servo_channel_, target_angle);
    publishJointStates(target_angle);
}
// 조인트 상태 발행
void MotorController::publishJointStates(float steering_angle)
{
    float wheel_radius = 0.035;                              // URDF에서 정의한 값과 동일하게
    float wheel_velocity = current_throttle_ / wheel_radius; // throttle을 rad/s로 변환

    joint_state_msg_.header.stamp = ros::Time::now();
    joint_state_msg_.name = {
        "steering_joint",
        "front_left_wheel_joint",
        "front_right_wheel_joint",
        "rear_left_wheel_joint",
        "rear_right_wheel_joint"};
    joint_state_msg_.position = {
        steering_angle * M_PI / 180.0, // steering 각도
        0.0, 0.0, 0.0, 0.0             // 회전 바퀴는 누적 position 불필요
    };
    joint_state_msg_.velocity = {
        0.0,                            // steering velocity
        wheel_velocity, wheel_velocity, // 전륜 속도
        wheel_velocity, wheel_velocity  // 후륜 속도
    };
    joint_state_pub_.publish(joint_state_msg_);
}