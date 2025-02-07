// src/sensors/pulse_sensor.cpp
#include "sensors/pulse_sensor.hpp"
#include <thread>
#include <chrono>

PulseSensor::PulseSensor(int adcChannel)
    : spi_(std::make_shared<SPI>(SPI::CHANNEL_0, SPI::CS0))
    , adcChannel_(adcChannel)
    , BPM_(0)
    , running_(false)
    , errorMessage_()
    , thread_() {
}

PulseSensor::~PulseSensor() {
    stopReading();
}

bool PulseSensor::startReading() {
    if (running_) {
        return true;
    }

    try {
        running_ = true;
        thread_ = std::make_unique<std::thread>(&PulseSensor::readLoop, this);
        clearError();
        return true;
    }
    catch (const std::exception& e) {
        updateError(e.what());
        running_ = false;
        return false;
    }
}

void PulseSensor::stopReading() {
    running_ = false;
    if (thread_ && thread_->joinable()) {
        thread_->join();
    }
    BPM_ = 0;
}

void PulseSensor::readLoop() {
    std::array<int, RATE_SIZE> rate;
    rate.fill(0);
    
    int sampleCounter = 0;
    int lastBeatTime = 0;
    int P = DEFAULT_P;
    int T = DEFAULT_T;
    int thresh = DEFAULT_THRESH;
    int amp = 100;
    bool firstBeat = true;
    bool secondBeat = false;
    int IBI = 600;
    bool Pulse = false;
    auto lastTime = std::chrono::steady_clock::now();

    while (running_) {
        try {
            // ADC에서 신호 읽기
            int Signal = spi_->readADC(adcChannel_);
            
            auto currentTime = std::chrono::steady_clock::now();
            auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(
                currentTime - lastTime).count();
            lastTime = currentTime;

            sampleCounter += elapsed;
            int N = sampleCounter - lastBeatTime;

            // 파형의 피크와 트로프 찾기
            if (Signal < thresh && N > (IBI/5)*3) {
                if (Signal < T) {
                    T = Signal;
                }
            }
            if (Signal > thresh && Signal > P) {
                P = Signal;
            }

            // 맥박 감지
            if (N > MIN_IBI) {
                if (Signal > thresh && !Pulse && N > (IBI/5)*3) {
                    Pulse = true;
                    IBI = sampleCounter - lastBeatTime;
                    lastBeatTime = sampleCounter;

                    if (secondBeat) {
                        secondBeat = false;
                        for (size_t i = 0; i < RATE_SIZE; i++) {
                            rate[i] = IBI;
                        }
                    }

                    if (firstBeat) {
                        firstBeat = false;
                        secondBeat = true;
                        continue;
                    }

                    // IBI 이동 평균 계산
                    int runningTotal = 0;
                    for (size_t i = 1; i < RATE_SIZE; i++) {
                        rate[i-1] = rate[i];
                    }
                    rate[RATE_SIZE-1] = IBI;
                    
                    for (int r : rate) {
                        runningTotal += r;
                    }

                    runningTotal /= RATE_SIZE;
                    BPM_ = 60000 / runningTotal;  // BPM 계산
                }
            }

            // 맥박이 끝났을 때
            if (Signal < thresh && Pulse) {
                Pulse = false;
                amp = P - T;
                thresh = amp/2 + T;
                P = thresh;
                T = thresh;
            }

            // 오랫동안 맥박이 감지되지 않을 때
            if (N > MAX_IBI) {
                thresh = DEFAULT_THRESH;
                P = DEFAULT_P;
                T = DEFAULT_T;
                lastBeatTime = sampleCounter;
                firstBeat = true;
                secondBeat = false;
                BPM_ = 0;
            }

            std::this_thread::sleep_for(std::chrono::milliseconds(SAMPLE_INTERVAL));
        }
        catch (const std::exception& e) {
            updateError(e.what());
            BPM_ = 0;
        }
    }
}

void PulseSensor::updateError(const std::string& error) {
    errorMessage_ = error;
}

void PulseSensor::clearError() {
    errorMessage_.clear();
}
