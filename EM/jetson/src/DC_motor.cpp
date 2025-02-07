#include "DC_motor.hpp"
#include <cmath>
#include <iostream>

PWMThrottleHat::PWMThrottleHat(PCA9685& pwm_device, uint8_t chan)
    : pwm(pwm_device), channel(chan) {
    std::cout << "\nInitializing PWMThrottleHat:" << std::endl;
    std::cout << "Base channel: " << static_cast<int>(channel) << std::endl;
}

void PWMThrottleHat::setThrottle(float throttle) {
    uint16_t pulse = static_cast<uint16_t>(4095 * std::abs(throttle));

    std::cout << "\nSetting throttle to " << throttle
              << " (pulse: " << pulse << ")" << std::endl;

    if (throttle > 0) {
        std::cout << "Forward motion" << std::endl;
        pwm.set_pwm(3, 4095);  // Full on
        pwm.set_pwm(4, 0);     // Full off
        pwm.set_pwm(5, pulse);  // Speed control
    }
    else if (throttle < 0) {
        std::cout << "Backward motion" << std::endl;
        pwm.set_pwm(3, 0);      // Full off
        pwm.set_pwm(4, 4095);   // Full on
        pwm.set_pwm(5, pulse);  // Speed control
    }
    else {
        std::cout << "Stop" << std::endl;
        pwm.set_pwm(3, 0);
        pwm.set_pwm(4, 0);
        pwm.set_pwm(5, 0);
    }
}
