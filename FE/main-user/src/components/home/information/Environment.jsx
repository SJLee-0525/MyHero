import React from "react";
import { useContext } from "react";
import { EnvironmentData } from "../../../store/environmentData";
import StatusWidget from "./StatusWidget";
import "../Home.css";

import Temperature from "../../../assets/stat-icons/thermostat.svg";
import Humidity from "../../../assets/stat-icons/humidity.svg";
import Airwave from "../../../assets/stat-icons/airwave.svg";
import Gas from "../../../assets/stat-icons/heat.svg";

export default function Environment() {
    const environmentDataStore = useContext(EnvironmentData);

    const dustLevel =
    (environmentDataStore.environmentData.data.dust_level
      ? environmentDataStore.environmentData.data.dust_level.toFixed(0)
      : environmentDataStore.environmentData.data.dust_level) || null;
    const ethanol =
        (environmentDataStore.environmentData.data.ethanol
        ? (environmentDataStore.environmentData.data.ethanol * 100).toFixed(1)
        : environmentDataStore.environmentData.data.ethanol) || null;

    return (<></>
        // <div id="environment">
        //     <div id="environment-info">
        //         <div id="environment-temp">
        //             <div id="info-title">실내 온도</div>
        //             <img src={Temperature} alt="temperature" />
        //             {environmentData.temperature}°C
        //         </div>
        //         <div id="environment-hum">
        //             <div id="info-title">실내 습도</div>
        //             <img src={Humidity} alt="humidity" />
        //             {environmentData.humidity}%
        //         </div>
        //         <div id="environment-dust">
        //             <div id="info-title">미세 먼지</div>
        //             <img src={Airwave} alt="dust" />
        //             {environmentData.dust_level} ㎍/㎥
        //         </div>
        //         <div id="environment-gas">
        //             <div id="info-title">에탄올 농도</div>
        //             <img src={Gas} alt="ethanol" />
        //             {environmentData.ethanol > 0 ? "가스 감지됨" : "가스 정상"}
        //         </div>
        //     </div>
        // </div>
    )
}