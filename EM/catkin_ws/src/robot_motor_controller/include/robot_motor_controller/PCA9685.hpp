#pragma once

#include "i2c.hpp"
#include <cstdint>

// PCA9685 registers
#define PCA9685_MODE1 0x00
#define PCA9685_MODE2 0x01
#define PCA9685_SUBADR1 0x02
#define PCA9685_SUBADR2 0x03
#define PCA9685_SUBADR3 0x04
#define PCA9685_ALLCALLADR 0x05
#define PCA9685_LED0_ON_L 0x06
#define PCA9685_PRESCALE 0xFE

// Mode bits
#define MODE1_RESTART 0x80
#define MODE1_EXTCLK 0x40
#define MODE1_AI 0x20
#define MODE1_SLEEP 0x10
#define MODE1_ALLCALL 0x01

class PCA9685 {
private:
    I2CDevice& i2c;
    
public:
    PCA9685(I2CDevice& i2c_device);
    void set_pwm(uint8_t channel, uint16_t duty_cycle);
};