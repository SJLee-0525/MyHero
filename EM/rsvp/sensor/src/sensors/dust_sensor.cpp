// src/sensors/dust_sensor.cpp
#include "sensors/dust_sensor.hpp"
#include <cmath>
#include <wiringPi.h>
#include <chrono>
#include <thread>

DustSensor::DustSensor(int ledPin)
    : ledPin_(ledPin)
    , running_(false)
    , dustDensity_(0.0f) {
}

DustSensor::~DustSensor() {
    stopReading();
}

bool DustSensor::initialize() {
    try {
        // LED 핀 설정
        pinMode(ledPin_, OUTPUT);
        digitalWrite(ledPin_, HIGH);  // LED 초기 상태는 OFF

        // SPI 초기화 (SPI0, CS0)
        spi_ = std::make_unique<SPI>(SPI::CHANNEL_0, SPI::CS0);
        
        clearError();
        return true;
    }
    catch (const std::exception& e) {
        updateError(std::string("Initialization failed: ") + e.what());
        return false;
    }
}

bool DustSensor::startReading() {
    if (running_) {
        return true;
    }

    if (!spi_) {
        updateError("SPI not initialized");
        return false;
    }

    try {
        running_ = true;
        readThread_ = std::make_unique<std::thread>(&DustSensor::readingLoop, this);
        clearError();
        return true;
    }
    catch (const std::exception& e) {
        updateError(std::string("Failed to start reading thread: ") + e.what());
        running_ = false;
        return false;
    }
}

bool DustSensor::stopReading() {
    running_ = false;
    if (readThread_ && readThread_->joinable()) {
        readThread_->join();
    }
    return true;
}

void DustSensor::readingLoop() {
    while (running_) {
        try {
            // LED ON (LOW is ON for this sensor)
            digitalWrite(ledPin_, LOW);
            
            // Wait for 280 microseconds
            std::this_thread::sleep_for(std::chrono::microseconds(280));
            
            // Read ADC
            uint16_t adcValue = spi_->readADC(7);
            // Wait for 40 microseconds
            std::this_thread::sleep_for(std::chrono::microseconds(40));
            
            // LED OFF
            digitalWrite(ledPin_, HIGH);
            
            // Wait for 9680 microseconds
            std::this_thread::sleep_for(std::chrono::microseconds(19680));

            // Calculate dust density
            float voltage = static_cast<float>(adcValue) * (5.0f / 1024.0f);
            dustDensity_ = (0.172f * voltage - 0.01f) * 1000.0f;
            
            clearError();
        }
        catch (const std::exception& e) {
            updateError(std::string("Reading error: ") + e.what());
            // Continue running despite error
        }
    }
}

void DustSensor::updateError(const std::string& error) {
    errorMessage_ = error;
}

void DustSensor::clearError() {
    errorMessage_.clear();
}
