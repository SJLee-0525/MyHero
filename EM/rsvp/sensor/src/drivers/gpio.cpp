// src/gpio.cpp
#include "drivers/gpio.hpp"
#include <system_error>
#include <thread>
#include <chrono>

GPIO::GPIO(int pin) : pin_(pin), basePath_("/sys/class/gpio/") {
    exportPin();
    // 시스템이 pin을 설정할 시간을 줌
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
}

GPIO::~GPIO() {
    unexportPin();
}

void GPIO::exportPin() {
    try {
        writeToFile(basePath_ + "export", std::to_string(pin_));
    } catch (const std::system_error& e) {
        if (e.code().value() != EEXIST) { // 이미 export된 경우는 무시
            throw;
        }
    }
}

void GPIO::unexportPin() {
    try {
        writeToFile(basePath_ + "unexport", std::to_string(pin_));
    } catch (const std::exception& e) {
        // Destructor에서는 예외를 무시
    }
}

void GPIO::setDirection(Direction dir) {
    std::string dirStr = (dir == Direction::IN) ? "in" : "out";
    writeToFile(basePath_ + "gpio" + std::to_string(pin_) + "/direction", dirStr);
    direction_ = dir;
}

void GPIO::setValue(Value value) {
    if (direction_ != Direction::OUT) {
        throw std::runtime_error("Cannot write to input pin");
    }
    writeToFile(basePath_ + "gpio" + std::to_string(pin_) + "/value", 
                std::to_string(static_cast<int>(value)));
}

GPIO::Value GPIO::getValue() const {
    std::string value = readFromFile(basePath_ + "gpio" + std::to_string(pin_) + "/value");
    return static_cast<Value>(std::stoi(value));
}

void GPIO::writeToFile(const std::string& path, const std::string& value) {
    std::ofstream file(path);
    if (!file.is_open()) {
        throw std::system_error(errno, std::system_category(), 
                              "Failed to open " + path);
    }
    file << value;
    if (file.fail()) {
        throw std::system_error(errno, std::system_category(), 
                              "Failed to write to " + path);
    }
}

std::string GPIO::readFromFile(const std::string& path) const {
    std::ifstream file(path);
    if (!file.is_open()) {
        throw std::system_error(errno, std::system_category(), 
                              "Failed to open " + path);
    }
    std::string value;
    file >> value;
    if (file.fail()) {
        throw std::system_error(errno, std::system_category(), 
                              "Failed to read from " + path);
    }
    return value;
}
