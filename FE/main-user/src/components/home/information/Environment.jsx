import React from "react";
import { useContext } from "react";
import { EnvironmentDataContext } from "../../../store/environmentData";
import StatusWidget from "./StatusWidget";
import "../Home.css";

import Temperature from "../../../assets/stat-icons/thermostat.svg";
import Humidity from "../../../assets/stat-icons/humidity.svg";
import Airwave from "../../../assets/stat-icons/airwave.svg";
import Gas from "../../../assets/stat-icons/heat.svg";

export default function Environment() {
    const environmentDataStore = useContext(EnvironmentDataContext);

    return (
        <div id="environment">
            <div id="environment-info">
                <StatusWidget
                    name="실내 온도"
                    imgSrc={Temperature}
                    altSrc="temperature"
                    status={`${environmentDataStore.environmentData.data.temperature} °C`}
                ></StatusWidget>
                <StatusWidget
                    name="실내 습도"
                    imgSrc={Humidity}
                    altSrc="humidity"
                    status={`${environmentDataStore.environmentData.data.humidity} %`}
                ></StatusWidget>
                <StatusWidget
                    name="미세 먼지"
                    imgSrc={Airwave}
                    altSrc="finedust"
                    status={`${environmentDataStore.environmentData.data.dust_level} ㎍/㎥`}
                ></StatusWidget>
                <StatusWidget
                    name="일산화탄소"
                    imgSrc={Gas}
                    altSrc="ethanol"
                    status={`${environmentDataStore.environmentData.data.ethanol} %`}
                >
                    {environmentDataStore.ethanol > 0 ? "가스 감지됨" : "가스 정상"}
                </StatusWidget>
            </div>
        </div>
    )
}