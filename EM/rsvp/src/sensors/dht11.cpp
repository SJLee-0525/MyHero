#include "sensors/dht11.hpp"
#include <wiringPi.h>
#include <cstring>

DHT11::DHT11(int pin)
    : pin_(pin)
    , temperature_(0.0f)
    , humidity_(0.0f)
    , errorMsg_(nullptr) {
    std::memset(data_, 0, sizeof(data_));
}

bool DHT11::read() {
    std::memset(data_, 0, sizeof(data_));
    errorMsg_ = nullptr;

    if (!readData()) {
        return false;
    }

    if (!validateChecksum()) {
        errorMsg_ = "Checksum error";
        return false;
    }

    humidity_ = static_cast<float>(data_[0]) + data_[1] * 0.1f;
    temperature_ = static_cast<float>(data_[2]) + data_[3] * 0.1f;

    return true;
}

bool DHT11::readData() {
    uint8_t laststate = HIGH;
    uint8_t counter = 0;
    uint8_t j = 0;

    pinMode(pin_, OUTPUT);
    digitalWrite(pin_, LOW);
    delay(18);  // 최소 18ms
    digitalWrite(pin_, HIGH);
    delayMicroseconds(40);
    pinMode(pin_, INPUT);

    for (int i = 0; i < MAXTIMINGS; i++) {
        counter = 0;
        while (digitalRead(pin_) == laststate) {
            counter++;
            delayMicroseconds(1);
            if (counter == 255) {
                break;
            }
        }
        laststate = digitalRead(pin_);

        if (counter == 255) break;

        if ((i >= 4) && (i % 2 == 0)) {
            data_[j / 8] <<= 1;
            if (counter > 16)
                data_[j / 8] |= 1;
            j++;
        }
    }

    if (j < 40) {
        errorMsg_ = "Data not received correctly";
        return false;
    }

    return true;
}

bool DHT11::validateChecksum() const {
    return data_[4] == ((data_[0] + data_[1] + data_[2] + data_[3]) & 0xFF);
}
