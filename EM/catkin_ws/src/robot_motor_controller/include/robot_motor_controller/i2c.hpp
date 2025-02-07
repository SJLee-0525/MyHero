#pragma once

#include <cstdint>
#include <string>

class I2CDevice {
private:
    int file;
    uint8_t address;

public:
    I2CDevice(const char* device, uint8_t addr);
    ~I2CDevice();

    void writeRegister(uint8_t reg, uint8_t value);
    uint8_t readRegister(uint8_t reg);
};