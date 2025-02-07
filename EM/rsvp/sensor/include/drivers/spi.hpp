// include/drivers/spi.hpp
#pragma once

#include <cstdint>
#include <string>
#include <stdexcept>

class SPI {
public:
    static constexpr int CHANNEL_0 = 0;
    static constexpr int CHANNEL_1 = 1;
    static constexpr int CS0 = 0;      // Chip Select 0
    static constexpr int CS1 = 1;      // Chip Select 1
    static constexpr int DEFAULT_SPEED = 1000000;  // 1MHz

    SPI(int channel, int chipSelect, int speed = DEFAULT_SPEED);
    ~SPI();

    // 복사 및 이동 연산 금지
    SPI(const SPI&) = delete;
    SPI& operator=(const SPI&) = delete;
    SPI(SPI&&) = delete;
    SPI& operator=(SPI&&) = delete;

    // MCP3008 ADC 읽기 (채널 0-7)
    uint16_t readADC(uint8_t adcChannel);
    
    // 일반적인 SPI 읽기/쓰기
    void transfer(uint8_t* data, size_t length);

    int getChannel() const { return channel_; }
    int getSpeed() const { return speed_; }
    bool isInitialized() const { return initialized_; }
    const std::string& getLastError() const { return lastError_; }

private:
    int channel_;
    int chipSelect_;
    int speed_;
    bool initialized_;
    std::string lastError_;

    void updateError(const std::string& error);
};
