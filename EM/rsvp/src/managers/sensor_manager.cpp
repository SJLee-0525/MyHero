//sensor_manager.cpp
#include "managers/sensor_manager.hpp"
#include <chrono>
#include <thread>

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
		//wiringPi 초기화
		if (wiringPiSetupGpio() == -1) {
			updateError("wiringPi initualzation failed");
			return false;
        }

        // DHT11 센서 초기화
        dht11_ = std::make_unique<DHT11>(DHT11_PIN);
        
        // 다른 센서들도 초기화 예정
        // dustSensor_ = std::make_unique<DustSensor>(DUST_PIN);
        ethanolSensor_ = std::make_unique<EthanolSensor>(0);
        // heartrateSensor_ = std::make_unique<HeartrateSensor>(HEARTRATE_PIN);

        clearError();
        return true;
    }
    catch (const std::exception& e) {
        updateError("Sensor initialization failed: " + std::string(e.what()));
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

	if(!readEthanol()){
		currentReadings.error_message = getLastError();
	}
	else {
		currentReadings.ethanol = lastReadings_.ethanol;
	}

    // 다른 센서들도 순차적으로 읽기
    // TODO: 다른 센서 구현 후 추가

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
        updateError("DHT11 read failed: " + std::string(dht11_->getErrorMessage()));
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
        updateError("Ethanol sensor read failed: " +
                   std::string(ethanolSensor_->getErrorMessage()));
        return false;
    }

    lastReadings_.ethanol = ethanolSensor_->getEthanolPPM();
    clearError();
    return true;
}

void SensorManager::updateError(const std::string& error) {
    lastError_ = error;
    lastReadings_.error_message = error;
}

void SensorManager::clearError() {
    lastError_.clear();
    lastReadings_.error_message.clear();
}
