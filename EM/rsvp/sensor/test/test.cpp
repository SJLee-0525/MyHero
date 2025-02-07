#include "managers/sensor_manager.hpp"
#include "DataSender.hpp"
#include <iostream>
#include <thread>
#include <chrono>
using namespace std;

int main() {
	SensorManager sm;
	sm.initialize();

	DataSender sender(
		"FlcuDLxVC9SolW70"
		,"https://dev-api.itdice.net/status/health"
		,"https://dev-api.itdice.net/status/home"
		,"https://dev-api.itdice.net/auth/login"
		,"https://dev-api.itdice.net/auth/logout"
	);
	if(sender.Login("", "")){
		SensorData Data = sm.readAllSensors();
		sender.SendEnvironmentData(Data);
		sender.SendHealthData(100.0);
		sender.Logout();
	}
	//while(true){
	//	SensorData Data = sm.readAllSensors();
	//	cout << "습도: " << Data.humidity << " %\n";
	//	cout << "ethanol : " << Data.ethanol << " %\n";
	//	cout << "BPM : " << Data.heartrate << "\n";
	//	cout << "dust dentisy: " << Data.dust << " ㎍/㎥\n";
	//	this_thread::sleep_for(chrono::seconds(2));
	//}
    return 0;
}

