#include "robot_motor_controller/PCA9685.hpp"
#include <thread>
#include <chrono>
#include <iostream>

PCA9685::PCA9685(I2CDevice& i2c_device) : i2c(i2c_device) {
    std::cout << "Initializing PCA9685..." << std::endl;
    
    // Software reset
    i2c.writeRegister(PCA9685_MODE1, MODE1_RESTART);
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
    
    // Set to sleep
    i2c.writeRegister(PCA9685_MODE1, MODE1_SLEEP);
    
    // Set prescale for ~60Hz
    i2c.writeRegister(PCA9685_PRESCALE, 0x65);  // Value from i2cdump
    
    // Wake up
    i2c.writeRegister(PCA9685_MODE1, MODE1_AI);  // Auto-increment enabled
    std::this_thread::sleep_for(std::chrono::milliseconds(5));
    
    // Enable restart
    i2c.writeRegister(PCA9685_MODE1, MODE1_AI | MODE1_RESTART);
    
    // Reset all channels
    for (int i = 0; i < 16; i++) {
        set_pwm(i, 0);
    }
}

void PCA9685::set_pwm(uint8_t channel, uint16_t duty_cycle) {
    uint8_t reg_base = PCA9685_LED0_ON_L + (channel * 4);
    
    // Set the 12 bits for PWM
    i2c.writeRegister(reg_base + 0, 0);
    i2c.writeRegister(reg_base + 1, 0);
    i2c.writeRegister(reg_base + 2, duty_cycle & 0xFF);
    i2c.writeRegister(reg_base + 3, (duty_cycle >> 8) & 0x0F);  // Only use lower 4 bits
    
    // Small delay after setting a channel
    std::this_thread::sleep_for(std::chrono::milliseconds(1));
}