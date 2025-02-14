import "./Toggle.css";

import { useContext } from "react";

import { UserProgressContext } from "../../store/userProgressStore";
import { HomeStatusContext } from "../../store/homeStatusStore";
import { HealthContext } from "../../store/healthStore";

import Toggle from "./Toggle";
import StatusToggle from "./StatusToggle";

import notificationOnImage from "../../assets/icons/notification.svg";
import notificationOffImage from "../../assets/icons/notification_off.svg";
import carImage from "../../assets/icons/car.svg";
import cameraImage from "../../assets/icons/camera.svg";
import micOnImage from "../../assets/icons/mic_on.svg";
import micOffImage from "../../assets/icons/mic_off.svg";
import thermostatImage from "../../assets/icons/thermostat.svg";
import heatImage from "../../assets/icons/heat.svg";
import airImage from "../../assets/icons/airwave.svg";
import fineAirImage from "../../assets/icons/fineair.svg";
import humidityImage from "../../assets/icons/humidity.svg";
import heartImage from "../../assets/icons/heart_plus.svg";

export default function ToggleGroup() {
  const userProgressStore = useContext(UserProgressContext);
  const homeStatusStore = useContext(HomeStatusContext);
  const healthStore = useContext(HealthContext);

  const dustLevel =
    homeStatusStore.homeStatus.length > 0
      ? homeStatusStore.homeStatus[0].dust_level.toFixed(0)
      : null;
  const ethanol =
    homeStatusStore.homeStatus.length > 0
      ? homeStatusStore.homeStatus[0].ethanol.toFixed(3)
      : null;
  const heartRate =
    (healthStore.healthStatus && healthStore.healthStatus[0]?.heart_rate) ||
    null;

  // console.log(dustLevel, ethanol, heartRate);

  return (
    <>
      <div id="toggle-group">
        <Toggle
          name="알림"
          identifier="notification"
          status={
            homeStatusStore.deviceStatus.is_alarm_enabled ? "good" : "bad"
          }
          imgSrc={
            homeStatusStore.deviceStatus.is_alarm_enabled
              ? notificationOnImage
              : notificationOffImage
          }
          altSrc="notification"
        ></Toggle>
        <Toggle
          name="카메라"
          identifier="camera"
          status={
            homeStatusStore.deviceStatus.is_camera_enabled ? "good" : "bad"
          }
          imgSrc={cameraImage}
          altSrc="camera"
        ></Toggle>
        <Toggle
          name="마이크"
          identifier="microphone"
          status={
            homeStatusStore.deviceStatus.is_microphone_enabled ? "good" : "bad"
          }
          imgSrc={
            homeStatusStore.deviceStatus.is_microphone_enabled
              ? micOnImage
              : micOffImage
          }
          altSrc="microphone"
        ></Toggle>
        <Toggle
          name="주행"
          identifier="car"
          status={
            homeStatusStore.deviceStatus.is_driving_enabled ? "good" : "bad"
          }
          imgSrc={carImage}
          altSrc="car"
        ></Toggle>
      </div>
      <hr />
      <div id="toggle-group">
        <StatusToggle
          name="온도"
          imgSrc={thermostatImage}
          altSrc="temperature"
          statusLevel={
            homeStatusStore.homeStatus.length > 0 &&
            homeStatusStore.homeStatus[0].temperature &&
            18 < homeStatusStore.homeStatus[0].temperature &&
            homeStatusStore.homeStatus[0].temperature < 26
              ? "good"
              : "bad"
          }
          status={`${
            homeStatusStore.homeStatus.length > 0
              ? `${homeStatusStore.homeStatus[0].temperature} ℃`
              : null
          }`}
        />
        <StatusToggle
          name="습도"
          imgSrc={humidityImage}
          altSrc="humidity"
          statusLevel={
            homeStatusStore.homeStatus.length > 0 &&
            homeStatusStore.homeStatus[0].humidity &&
            40 < homeStatusStore.homeStatus[0].humidity &&
            homeStatusStore.homeStatus[0].humidity < 70
              ? "good"
              : "bad"
          }
          status={`${
            homeStatusStore.homeStatus.length > 0
              ? `${homeStatusStore.homeStatus[0].humidity} %`
              : null
          }`}
        />
        <StatusToggle
          name="미세 먼지"
          imgSrc={airImage}
          altSrc="dust"
          statusLevel={
            homeStatusStore.homeStatus.length > 0 &&
            homeStatusStore.homeStatus[0].dust_level &&
            homeStatusStore.homeStatus[0].dust_level < 40
              ? "good"
              : "bad"
          }
          status={`${dustLevel ? `${dustLevel}㎍/㎥` : null}`}
        />
        <StatusToggle
          name="초미세 먼지"
          imgSrc={fineAirImage}
          altSrc="finedust"
          statusLevel={
            homeStatusStore.homeStatus.length > 0 &&
            homeStatusStore.homeStatus[0].others?.ultrafinedust &&
            homeStatusStore.homeStatus[0].others?.ultrafinedust < 30
              ? "good"
              : "bad"
          }
          status={`${
            homeStatusStore.homeStatus.length > 0 &&
            homeStatusStore.homeStatus[0].others.ultrafinedust
              ? `${homeStatusStore.homeStatus[0].others.ultrafinedust}㎍/㎥`
              : null
          }`}
        />
        <StatusToggle
          name="일산화탄소"
          imgSrc={heatImage}
          altSrc="gas"
          statusLevel={
            homeStatusStore.homeStatus.length > 0 &&
            homeStatusStore.homeStatus[0].ethanol > 0 &&
            homeStatusStore.homeStatus[0].ethanol < 1.5
              ? "good"
              : "bad"
          }
          status={`${ethanol ? `${ethanol} %` : null}`}
        />
        <StatusToggle
          name="심박"
          imgSrc={heartImage}
          altSrc="heartrate"
          statusLevel={60 < heartRate || heartRate < 120 ? "good" : "bad"}
          status={`${heartRate ? `${heartRate} bpm` : null}`}
        />
      </div>
    </>
  );
}
