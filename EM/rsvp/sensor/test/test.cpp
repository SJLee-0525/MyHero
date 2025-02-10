#include "managers/sensor_manager.hpp"
#include "DataSender.hpp"
#include "managers/CredentialsManager.hpp"
#include <iostream>
#include <thread>
#include <chrono>
#include <cstdlib>
#include <fstream>
using namespace std;

void load_env() {
    std::ifstream file(".env");
    if (!file.is_open()) {
        std::cerr << "Could not open .env file" << std::endl;
        return;
    }
    
    std::string line;    
    while (std::getline(file, line)) {
        if (line.empty() || line[0] == '#') continue;
        
        size_t pos = line.find('=');
        if (pos != std::string::npos) {
            std::string key = line.substr(0, pos);
            std::string value = line.substr(pos + 1);
            
            if (!key.empty() && !value.empty()) {
                setenv(key.c_str(), value.c_str(), 1);
            }
        }
    }
}

int main() {
	load_env();
	SensorManager sm;
	CredentialsManager cm;
	string userid, password;
	const char* health_data_url = getenv("health_data_url");
	const char* environment_data_url = getenv("environment_data_url");
	const char* login_url = getenv("login_url");
	const char* logout_url = getenv("logout_url");
	const char* family_id = getenv("family_id");
	if(family_id){
		cout << "저장된 Family_ID가 있습니다.\n";
	}
	else{
		cout << "저장된 Family_ID가 없습니다. \nFamily_Id: ";
		string new_family_id;
		cin >> new_family_id;
		setenv("family_id", new_family_id.c_str(), 1);
	}
	
    DataSender sender(
		family_id,
		health_data_url,
		environment_data_url,
		login_url,
		logout_url
    );

	if(!cm.loadCredentials(userid, password)){
		cout << "최초 로그인 하십시오. \nUserId: ";
		cin >> userid;
		cout << "Password: ";
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

