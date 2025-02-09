import React from "react";
import "../Home.css";

export default function Weather() {
    return (
        <div id="weather" style={{ height: "100%" }}>
            <div id="weather-title">날씨</div>
            <div id="weather-info">
                <img src="https://www.weatherbit.io/static/img/icons/r01d.png" alt="weather-icon"/>
                <div id="weather-detail">
                    <div id="weather-temp">15°C</div>
                    <div id="weather-location">서울특별시</div>
                </div>
            </div>
        </div>

    )
}