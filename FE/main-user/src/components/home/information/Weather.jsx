import React from "react";
import { useContext } from "react";
import { WeatherStoreContext } from "../../../store/weatherStore";
import "../Home.css";

export default function Weather() {
    const { weatherData, isLoading } = useContext(WeatherStoreContext);

    return (
        <div id="weather" style={{ height: "100%" }}>
            <div id="weather-title">날씨</div>
            <div id="weather-info">
                <img src="https://www.weatherbit.io/static/img/icons/r01d.png" alt="weather-icon"/>
                <div id="weather-detail">
                    <div id="weather-temp">{`${weatherData.temperature}`}°C</div>
                    <div id="weather-location">{`${weatherData.address}`}</div>
                </div>
            </div>
        </div>

    )
}