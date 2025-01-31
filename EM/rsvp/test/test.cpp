#include "managers/sensor_manager.hpp"
#include <iostream>
#include <thread>
#include <chrono>
using namespace std;

int main() {
	SensorManager sm;
	sm.initialize();
	while(true){
		SensorData Data = sm.readAllSensors();
		cout << "온도: " << Data.temperature << " C , ";
		cout << "습도: " << Data.humidity << " %\n";
		cout << "ethanol : " << Data.ethanol << " %\n";
		this_thread::sleep_for(chrono::seconds(2));
	}
    return 0;
}

