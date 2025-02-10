import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useMainHttp } from "../../../hooks/useMainHttp";
import { UserProgressContext } from "../../../store/userProgressStore";
import "../Home.css";

import Temperature from "../../../assets/stat-icons/thermostat.svg";
import Humidity from "../../../assets/stat-icons/humidity.svg";
import Airwave from "../../../assets/stat-icons/airwave.svg";
import Gas from "../../../assets/stat-icons/heat.svg";

export default function Environment() {
    const { request, loading, error } = useMainHttp();
    const { familyInfo } = useContext(UserProgressContext);
    const familyId = familyInfo?.familyId;

    const [environmentData, setEnvironmentData] = useState({
        temperature: "--",
        humidity: "--",
        dust: "--",
        ethanol: "--"
    });

    useEffect(() => {
        if (!familyId) return;
        
        const fetchEnvironmentData = async () => {
            try {
                const response = await request(`/status/home/latest/${familyId}`, "GET");

                if (response.success) {
                    const { temperature, humidity, dust_level, ethanol } = response.data;
                    setEnvironmentData({
                        temperature,
                        humidity,
                        dust: dust_level,
                        ethanol
                    });
                } else {
                    console.error("환경 데이터를 로드 실패:", response.error);
                }
            } catch (error) {
                console.error("환경 데이터를 불러오는 중 오류 발생:", error);
            }
        };

        fetchEnvironmentData();
    }, [familyId]);

    return (
        <div id="environment">
            <div id="environment-info">
                <div id="environment-temp">
                    <div id="info-title">실내 온도</div>
                    <img src={Temperature} alt="temperature" />
                    {environmentData.temperature}°C
                </div>
                <div id="environment-hum">
                    <div id="info-title">실내 습도</div>
                    <img src={Humidity} alt="humidity" />
                    {environmentData.humidity}%
                </div>
                <div id="environment-dust">
                    <div id="info-title">미세 먼지</div>
                    <img src={Airwave} alt="dust" />
                    {environmentData.dust_level} ㎍/㎥
                </div>
                <div id="environment-gas">
                    <div id="info-title">에탄올 농도</div>
                    <img src={Gas} alt="ethanol" />
                    {environmentData.ethanol > 0 ? "가스 감지됨" : "가스 정상"}
                </div>
            </div>
        </div>
    )
}