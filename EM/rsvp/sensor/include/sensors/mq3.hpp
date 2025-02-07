// include/sensors/mq3.hpp
#pragma once

#include "drivers/spi.hpp"
#include <memory>
#include <string>
#include <chrono>

class EthanolSensor {
public:
    explicit EthanolSensor(int adcChannel);
    ~EthanolSensor() = default;

    // 복사 및 이동 연산 금지
    EthanolSensor(const EthanolSensor&) = delete;
    EthanolSensor& operator=(const EthanolSensor&) = delete;
    EthanolSensor(EthanolSensor&&) = delete;
    EthanolSensor& operator=(EthanolSensor&&) = delete;

    bool read();
    float getEthanolPPM() const { return ethanolPPM_; }
    float getVoltage() const { return voltage_; }
    const std::string& getErrorMessage() const { return errorMessage_; }

private:
    static constexpr float VCC = 3.3f;           // 참조 전압
    static constexpr float R0 = 10.0f;           // 깨끗한 공기에서의 센서 저항 (kΩ)
    static constexpr float RL = 10.0f;           // 부하 저항 (kΩ)
    static constexpr int ADC_MAX = 1023;         // 10-bit ADC 최대값

    // MQ-3 센서 특성 곡선 파라미터
    // MQ-3 데이터시트 기반 보정값
    static constexpr float CURVE_SLOPE = -0.63f;   // 기울기
    static constexpr float CURVE_INTERCEPT = 1.33f; // y절편

    std::shared_ptr<SPI> spi_;
    int adcChannel_;
    float ethanolPPM_;
    float voltage_;
    std::string errorMessage_;
    std::chrono::steady_clock::time_point lastReadTime_;

    void calculatePPM(float rs);
    void updateError(const std::string& error);
};
