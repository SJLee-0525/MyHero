#pragma once

#include "PCA9685.hpp"
#include <cstdint>

class Servo {
private:
    PCA9685& pwm;
    static constexpr float MIN_PULSE = 150.0;
    static constexpr float MAX_PULSE = 600.0;

public:
    Servo(PCA9685& pwm_device);
    void setAngle(uint8_t channel, float angle);  // 0 to 180 degrees
};