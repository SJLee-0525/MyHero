//DataSender.hpp
#pragma once
#include <string>
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include "managers/sensor_manager.hpp"

using json = nlohmann::json;

class DataSender{
private:
	std::string FamilyId;
	std::string HealthDataUrl;
	std::string EnvironmentDataUrl;
	std::string LoginUrl;
	std::string LogoutUrl;
	CURL* curl;

	static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp);
	bool SendRequest(const std::string& url, const json& jsonData);

public:
	DataSender(const std::string& FamilyId, const std::string& HealthDataUrl, const std::string& EnvironmentDataUrl, const std::string& LoginUrl, const std::string& LogoutUrl);
	~DataSender();

	bool SendHealthData(float heartRate);
	bool SendEnvironmentData(const SensorData& data);
	bool Login(const std::string& id, const std::string& password);
	bool Logout();
};
