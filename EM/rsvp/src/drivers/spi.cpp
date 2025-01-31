// src/drivers/spi.cpp
#include "drivers/spi.hpp"
#include <wiringPi.h>
#include <wiringPiSPI.h>

constexpr int SPI::CHANNEL_0;
constexpr int SPI::CHANNEL_1;
constexpr int SPI::DEFAULT_SPEED;

SPI::SPI(int channel, int speed) 
    : channel_(channel)
    , speed_(speed)
    , initialized_(false)
    , lastError_() {
    
    if (channel != CHANNEL_0 && channel != CHANNEL_1) {
        throw std::runtime_error("Invalid SPI channel");
    }

    if (wiringPiSPISetup(channel_, speed_) == -1) {
        updateError("SPI initialization failed");
        throw std::runtime_error(lastError_);
    }

    initialized_ = true;
}

SPI::~SPI() {
    // wiringPi doesn't provide SPI cleanup function
}

uint16_t SPI::readADC(uint8_t adcChannel) {
    if (adcChannel > 7) {
        throw std::runtime_error("Invalid ADC channel");
    }

    uint8_t buffer[3] = {0};
    buffer[0] = 0x01;                    // 시작 비트
    buffer[1] = (0x08 | adcChannel) << 4;// Single-ended 모드 + 채널 선택
    buffer[2] = 0x00;

    transfer(buffer, 3);

    // 10비트 결과값 반환
    return ((buffer[1] & 0x03) << 8) | buffer[2];
}

void SPI::transfer(uint8_t* data, size_t length) {
    if (!initialized_) {
        throw std::runtime_error("SPI not initialized");
    }

    if (wiringPiSPIDataRW(channel_, data, length) == -1) {
        updateError("SPI transfer failed");
        throw std::runtime_error(lastError_);
    }
}

void SPI::updateError(const std::string& error) {
    lastError_ = error;
}
