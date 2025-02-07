// include/managers/sensor_manager.hpp
#pragma once

#include <memory>
#include <mutex>
#include <string>
#include <unordered_map>
#include <wiringPi.h>
#include "sensors/dht11.hpp"
#include "sensors/mq3.hpp"
#include "sensors/pulse_sensor.hpp"

struct SensorData {
    float temperature;
    float humidity;
    float dust;
    float ethanol;
    float heartrate;
    std::string error_message;
};

class SensorManager {
public:
    SensorManager();
    ~SensorManager() = default;

    // 복사 및 이동 연산 금지
    SensorManager(const SensorManager&) = delete;
    SensorManager& operator=(const SensorManager&) = delete;
    SensorManager(SensorManager&&) = delete;
    SensorManager& operator=(SensorManager&&) = delete;

    // 센서 초기화
    bool initialize();

    // 모든 센서 데이터 읽기
    SensorData readAllSensors();

    // 특정 센서의 마지막 읽은 값 반환
    SensorData getLastReadings() const;

    // 에러 메시지 반환
    const std::string& getLastError() const { return lastError_; }

private:
    static constexpr int DHT11_PIN = 2;     // DHT11 센서 핀
    static constexpr int DUST_PIN = 22;      // 먼지 센서 핀
    static constexpr int ETHANOL_PIN = 27;   // 에탄올 센서 핀
    static constexpr int HEARTRATE_PIN = 23; // 심박 센서 핀

    // 센서 객체들
    std::unique_ptr<DHT11> dht11_;
    std::unique_ptr<EthanolSensor> ethanolSensor_;
    std::unique_ptr<PulseSensor> pulseSensor_;
    // std::unique_ptr<DustSensor> dustSensor_;  // 향후 구현 예정

    mutable std::mutex mutex_;           // 데이터 접근 보호
    SensorData lastReadings_;            // 마지막으로 읽은 센서 값들
    std::string lastError_;              // 마지막 에러 메시지

    // 내부 helper 함수들
    bool readDHT11();
    bool readEthanol();
    bool readPulse();
    void updateError(const std::string& error);
    void clearError();
};
