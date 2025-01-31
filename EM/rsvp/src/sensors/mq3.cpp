// src/sensors/mq3.cpp
#include "sensors/mq3.hpp"
#include <cmath>

EthanolSensor::EthanolSensor(int adcChannel)
    : spi_(std::make_shared<SPI>(SPI::CHANNEL_0, SPI::CS0))
    , adcChannel_(adcChannel)
    , ethanolPPM_(0.0f)
    , voltage_(0.0f)
    , errorMessage_()
    , lastReadTime_(std::chrono::steady_clock::now()) {
}

bool EthanolSensor::read() {
    try {
        // ADC 값 읽기
        uint16_t adcValue = spi_->readADC(adcChannel_);

        // 전압 계산
        voltage_ = (static_cast<float>(adcValue) / ADC_MAX) * VCC;

        // 센서 저항(Rs) 계산
        float rs = RL * (VCC - voltage_) / voltage_;

        // PPM 값 계산
        calculatePPM(rs);

        lastReadTime_ = std::chrono::steady_clock::now();
        return true;
    }
    catch (const std::exception& e) {
        updateError(e.what());
        return false;
    }
}

void EthanolSensor::calculatePPM(float rs) {
    // Rs/R0 비율 계산
    float rsR0Ratio = rs / R0;

    // MQ-3 센서의 특성 곡선을 이용한 알코올 농도 계산
    float logRsR0 = std::log10(rsR0Ratio);
    float logAlcohol = (logRsR0 - CURVE_INTERCEPT) / CURVE_SLOPE;

    // mg/L 단위로 변환 (0.1~10mg/L 범위)
    float alcoholMgL = std::pow(10.0f, logAlcohol);

    // mg/L를 PPM으로 변환 (1mg/L = 약 522ppm at 20°C)
    // PPM을 퍼센트로 변환 (PPM * 0.0001 = %)
    ethanolPPM_ = alcoholMgL * 522.0f * 0.0001f;

    // 범위 제한 (0~100%)
    if (ethanolPPM_ < 0.0f) ethanolPPM_ = 0.0f;
    if (ethanolPPM_ > 100.0f) ethanolPPM_ = 100.0f;
}

void EthanolSensor::updateError(const std::string& error) {
    errorMessage_ = error;
}
