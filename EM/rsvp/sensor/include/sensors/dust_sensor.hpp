// include/sensors/dust_sensor.hpp
#pragma once

#include <atomic>
#include <thread>
#include <string>
#include <memory>
#include "drivers/spi.hpp"

class DustSensor{
public:
	explicit DustSensor(int ledPin = 21);
	~DustSensor();

	// 복사 및 이동 연산 금지
	DustSensor(const DustSensor&) = delete;
	DustSensor& operator = (const DustSensor&) = delete;
	DustSensor(DustSensor&&) = delete;
	DustSensor& operator=(DustSensor&&) = delete;

	bool initialize();
	bool startReading();
	bool stopReading();
	bool isRunning() const { return running_; }
	float getDustDensity() const { return dustDensity_; }
	const std::string& getErrorMessage() const { return errorMessage_; }

private:
	const int ledPin_;
	std::shared_ptr<SPI> spi_;
    std::atomic<bool> running_;
    std::atomic<float> dustDensity_;
    std::string errorMessage_;
    std::unique_ptr<std::thread> readThread_;

    void readingLoop();
    void updateError(const std::string& error);
    void clearError();
};
