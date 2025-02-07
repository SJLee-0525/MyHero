// include/sensors/pulse_sensor.hpp
#pragma once

#include "drivers/spi.hpp"
#include <memory>
#include <thread>
#include <atomic>
#include <array>
#include <chrono>

class PulseSensor {
public:
    explicit PulseSensor(int adcChannel);
    ~PulseSensor();

    // 복사 및 이동 연산 금지
    PulseSensor(const PulseSensor&) = delete;
    PulseSensor& operator=(const PulseSensor&) = delete;
    PulseSensor(PulseSensor&&) = delete;
    PulseSensor& operator=(PulseSensor&&) = delete;

    bool startReading();
    void stopReading();
    int getBPM() const { return BPM_; }
    bool isRunning() const { return running_; }
    const std::string& getErrorMessage() const { return errorMessage_; }

private:
    static constexpr size_t RATE_SIZE = 10;    // 이동 평균을 위한 배열 크기
    static constexpr int SAMPLE_INTERVAL = 5;   // 샘플링 간격 (ms)
    static constexpr int DEFAULT_THRESH = 525;  // 기본 임계값
    static constexpr int DEFAULT_P = 512;       // 기본 피크값
    static constexpr int DEFAULT_T = 512;       // 기본 트로프값
    static constexpr int MIN_IBI = 250;         // 최소 심박 간격 (ms)
    static constexpr int MAX_IBI = 2500;        // 최대 심박 간격 (ms)

    std::shared_ptr<SPI> spi_;
    int adcChannel_;
    std::atomic<int> BPM_;
    std::atomic<bool> running_;
    std::string errorMessage_;
    std::unique_ptr<std::thread> thread_;

    void updateError(const std::string& error);
    void clearError();
    void readLoop();
};
