#include "managers/sensor_manager.hpp"
#include "DataSender.hpp"
#include "managers/CredentialsManager.hpp"
#include <iostream>
#include <thread>
#include <chrono>
using namespace std;

int main() {
	SensorManager sm;
	CredentialsManager cm;
	string userid, password;
	
    DataSender sender(
        "FlcuDLxVC9SolW70"
        ,"https://dev-api.itdice.net/status/health"
        ,"https://dev-api.itdice.net/status/home"
        ,"https://dev-api.itdice.net/auth/login"
        ,"https://dev-api.itdice.net/auth/logout"
    );

	if(!cm.loadCredentials(userid, password)){
		cout << "최초 로그인 하십시오. \nUserId: ";
		cin >> userid;
		cout << "Password: \n";
		cin >> password;
		if(sender.Login(userid, password)){
			cm.saveCredentials(userid, password);
			cout << "로그인 정보가 저장되었습니다.\n";
		}
		else{
			while(1){
				cout << "로그인 정보가 잘못되었습니다.\n";
				cout << "다시 로그인 하십시오\n.UserId: ";
				cin >> userid;
				cout << "Password: ";
				cin >> password;
				if(sender.Login(userid, password)){
					cm.saveCredentials(userid, password);
					cout << "로그인 정보가 저장되었습니다.\n";
					break;
				}
			}
		}
	}
	else{
		sender.Login(userid, password);
	}

	sm.initialize();

	SensorData Data = sm.readAllSensors();
	sender.SendEnvironmentData(Data);
	sender.SendHealthData(100.0);
	sender.Logout();

    return 0;
}

