import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "../Home.css";

import Temperature from "../../../assets/stat-icons/thermostat.svg";
import Humidity from "../../../assets/stat-icons/humidity.svg";
import Airwave from "../../../assets/stat-icons/airwave.svg";
import Gas from "../../../assets/stat-icons/heat.svg";

export default function Environment() {
    const [environmentData, setEnvironmentData] = useState({
        temperature: "--",
        humidity: "--",
        dust: "--",
        ethanol: "--"
    });

    useEffect(() => {
        const fetchEnvironmentData = async () => {
            try {
                const familyId = "FlcuDLxVC9SolW70";
                const API_URL = `http://localhost:3000/status/home/latest/${familyId}`;

                const response = await axios.get(API_URL);
                console.log(response.data);

                const { temperature, humidity, dust_level, ethanol } = response.data;

                setEnvironmentData({
                    temperature,
                    humidity,
                    dust: dust_level,
                    ethanol
                });

            } catch (error) {
                console.error("환경 데이터를 불러오는 중 오류 발생:", error);
            }
        };

        fetchEnvironmentData();
    }, []);

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