#include "robot_motor_controller/i2c.hpp"
#include <stdexcept>
#include <linux/i2c-dev.h>
#include <sys/ioctl.h>
#include <fcntl.h>
#include <unistd.h>
#include <iomanip>
#include <thread>
#include <chrono>
#include <iostream>

I2CDevice::I2CDevice(const char* device, uint8_t addr) : address(addr) {
    file = open(device, O_RDWR);
    if (file < 0) {
        throw std::runtime_error("Failed to open I2C device");
    }
    if (ioctl(file, I2C_SLAVE, address) < 0) {
        throw std::runtime_error("Failed to acquire bus access");
    }
    std::cout << "I2C device opened successfully at address 0x" 
              << std::hex << static_cast<int>(address) << std::dec << std::endl;
}

I2CDevice::~I2CDevice() {
    if (file >= 0) {
        close(file);
    }
}

void I2CDevice::writeRegister(uint8_t reg, uint8_t value) {
    uint8_t buffer[2] = {reg, value};
    if (write(file, buffer, 2) != 2) {
        throw std::runtime_error("Failed to write to I2C device");
    }
    
    // Add a small delay after each write
    std::this_thread::sleep_for(std::chrono::microseconds(100));
}

uint8_t I2CDevice::readRegister(uint8_t reg) {
    uint8_t value;
    if (write(file, &reg, 1) != 1) {
        throw std::runtime_error("Failed to write register to I2C device");
    }
    if (read(file, &value, 1) != 1) {
        throw std::runtime_error("Failed to read from I2C device");
    }
    return value;
}
