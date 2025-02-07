#pragma once

#include "PCA9685.hpp"
#include <cstdint>

class PWMThrottleHat {
private:
    PCA9685& pwm;
    uint8_t channel;

public:
    PWMThrottleHat(PCA9685& pwm_device, uint8_t chan);
    void setThrottle(float throttle);
};

