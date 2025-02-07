// include/gpio.hpp
#pragma once
#include <string>
#include <fstream>
#include <stdexcept>

class GPIO {
public:
    enum Direction {
        IN,
        OUT
    };
    
    enum Value {
        LOW = 0,
        HIGH = 1
    };

    GPIO(int pin);
    ~GPIO();

    void setDirection(Direction dir);
    void setValue(Value value);
    Value getValue() const;
    int getPin() const { return pin_; }
    
private:
    int pin_;
    Direction direction_;
    std::string basePath_;
    
    void exportPin();
    void unexportPin();
    void writeToFile(const std::string& path, const std::string& value);
    std::string readFromFile(const std::string& path) const;
};
