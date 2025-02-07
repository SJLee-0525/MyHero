#include "robot_motor_controller/Servo_motor.hpp"
#include <iostream>

Servo::Servo(PCA9685& pwm_device) : pwm(pwm_device) {}

void Servo::setAngle(uint8_t channel, float angle) {
	angle += 90;
    if (angle < 45) angle = 45;
    if (angle > 135) angle = 135;

    float pulse_length = MIN_PULSE + (MAX_PULSE - MIN_PULSE) * angle / 180.0;
    uint16_t pulse = static_cast<uint16_t>(pulse_length);
    
    pwm.set_pwm(channel, pulse);
}
