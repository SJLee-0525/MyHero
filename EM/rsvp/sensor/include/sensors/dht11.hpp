//dht11.hpp
#pragma once
#include <cstdint>

class DHT11 {
public:
    explicit DHT11(int pin);  // wiringPi pin number
    ~DHT11() = default;

    // 복사 및 이동 연산 금지
    DHT11(const DHT11&) = delete;
    DHT11& operator=(const DHT11&) = delete;
    DHT11(DHT11&&) = delete;
    DHT11& operator=(DHT11&&) = delete;

    // 센서 읽기 시도. 성공하면 true 반환
    bool read();

    // 마지막으로 읽은 값 반환
    float getTemperature() const { return temperature_; }
    float getHumidity() const { return humidity_; }

    // 에러 메시지 반환
    const char* getErrorMessage() const { return errorMsg_; }

private:
    static constexpr int MAXTIMINGS = 85;

    int pin_;           // wiringPi pin number
    float temperature_; // 온도 (섭씨)
    float humidity_;    // 습도 (%)
    uint8_t data_[5];   // 센서로부터 읽은 raw 데이터
    const char* errorMsg_; // 에러 메시지

    // 내부 구현 함수들
    void initialize();
    bool readData();
    bool validateChecksum() const;
};

