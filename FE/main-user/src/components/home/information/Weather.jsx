import React from "react";
import { useContext } from "react";
import { WeatherStoreContext } from "../../../store/weatherStore";
import "../Home.css";

export default function Weather() {
    const { weatherData, isLoading } = useContext(WeatherStoreContext);

    const skyIcons = {
        "맑음": "",
        "구름조금": "",
        "구름많음": "",
        "흐림": "",
    }

    const rainIcons = {
        "비": "",
        "비/눈": "",
        "눈": "",
        "소나기기": "",
    }

    let weatherIcon = skyIcons[weatherData.sky] || skyIcons["맑음"];

    if (weatherData.precipitation !== "없음") {
        weatherIcon = rainIcons[weatherData.precipitation] || weatherIcon;
    }


    return (
        <div id="weather" style={{ height: "100%" }}>
            <div id="weather-title">날씨</div>
            <div id="weather-info">
                <img src={weatherIcon} alt="weather-icon"/>
                <div id="weather-detail">
                    <div id="weather-temp">{`${weatherData.temperature}`}</div>
                    <div id="weather-location">{`${weatherData.address}`}</div>
                </div>
            </div>
        </div>

    )
}