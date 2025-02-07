// src/managers/sensor_manager.cpp
#include "managers/sensor_manager.hpp"
#include <chrono>
#include <thread>
#include <string>

// static constexpr 변수 정의
constexpr int SensorManager::DHT11_PIN;
constexpr int SensorManager::DUST_PIN;
constexpr int SensorManager::ETHANOL_PIN;
constexpr int SensorManager::HEARTRATE_PIN;

SensorManager::SensorManager()
    : lastReadings_({0.0f, 0.0f, 0.0f, 0.0f, 0.0f, ""}) {
}

bool SensorManager::initialize() {
    std::lock_guard<std::mutex> lock(mutex_);
    try {
        // wiringPi 초기화
        if (wiringPiSetupGpio() == -1) {
            updateError("wiringPi initialization failed");
            return false;
        }

        // DHT11 센서 초기화
        dht11_ = std::make_unique<DHT11>(DHT11_PIN);

        // 에탄올 센서 초기화 (SPI0, CS0)
        ethanolSensor_ = std::make_unique<EthanolSensor>(0);

        // 심박 센서 초기화 (SPI0, CS1)
        pulseSensor_ = std::make_unique<PulseSensor>(1);
        if (!pulseSensor_->startReading()) {
            updateError(std::string("Failed to start pulse sensor: ") + pulseSensor_->getErrorMessage());
            return false;
        }

        clearError();
        return true;
    }
    catch (const std::exception& e) {
        updateError(std::string("Sensor initialization failed: ") + e.what());
        return false;
    }
}

SensorData SensorManager::readAllSensors() {
    std::lock_guard<std::mutex> lock(mutex_);
    SensorData currentReadings = {0.0f, 0.0f, 0.0f, 0.0f, 0.0f, ""};

    // DHT11 센서 읽기
    if (!readDHT11()) {
        currentReadings.error_message = getLastError();
    }
    else {
        currentReadings.temperature = lastReadings_.temperature;
        currentReadings.humidity = lastReadings_.humidity;
    }

    // 에탄올 센서 읽기
    if (!readEthanol()) {
        currentReadings.error_message = getLastError();
    }
    else {
        currentReadings.ethanol = lastReadings_.ethanol;
    }

    // 심박 센서 읽기
    if (!readPulse()) {
        currentReadings.error_message = getLastError();
    }
    else {
        currentReadings.heartrate = lastReadings_.heartrate;
    }

    return currentReadings;
}

SensorData SensorManager::getLastReadings() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return lastReadings_;
}

bool SensorManager::readDHT11() {
    if (!dht11_) {
        updateError("DHT11 sensor not initialized");
        return false;
    }

    if (!dht11_->read()) {
        updateError(std::string("DHT11 read failed: ") + dht11_->getErrorMessage());
        return false;
    }

    lastReadings_.temperature = dht11_->getTemperature();
    lastReadings_.humidity = dht11_->getHumidity();
    clearError();
    return true;
}

bool SensorManager::readEthanol() {
    if (!ethanolSensor_) {
        updateError("Ethanol sensor not initialized");
        return false;
    }

    if (!ethanolSensor_->read()) {
        updateError(std::string("Ethanol sensor read failed: ") + ethanolSensor_->getErrorMessage());
        return false;
    }

    lastReadings_.ethanol = ethanolSensor_->getEthanolPPM();
    clearError();
    return true;
}

bool SensorManager::readPulse() {
    if (!pulseSensor_) {
        updateError("Pulse sensor not initialized");
        return false;
    }

    if (!pulseSensor_->isRunning()) {
        updateError("Pulse sensor is not running");
        return false;
    }

    lastReadings_.heartrate = static_cast<float>(pulseSensor_->getBPM());
    
    const std::string& errorMsg = pulseSensor_->getErrorMessage();
    if (errorMsg.empty()) {
        clearError();
        return true;
    }
    else {
        updateError(std::string("Pulse sensor error: ") + errorMsg);
        return false;
    }
}

void SensorManager::updateError(const std::string& error) {
    lastError_ = error;
    lastReadings_.error_message = error;
}

void SensorManager::clearError() {
    lastError_.clear();
    lastReadings_.error_message.clear();
}
