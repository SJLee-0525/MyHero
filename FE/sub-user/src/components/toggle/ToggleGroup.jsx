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
import humidityImage from "../../assets/icons/humidity.svg";
import heartImage from "../../assets/icons/heart_plus.svg";

export default function ToggleGroup() {
  const userProgressStore = useContext(UserProgressContext);
  const homeStatusStore = useContext(HomeStatusContext);
  const healthStore = useContext(HealthContext);

  const dustLevel =
    (homeStatusStore.homeStatus.data.dust_level
      ? homeStatusStore.homeStatus.data.dust_level.toFixed(0)
      : homeStatusStore.homeStatus.data.dust_level) || null;
  const ethanol =
    (homeStatusStore.homeStatus.data.ethanol
      ? (homeStatusStore.homeStatus.data.ethanol * 100).toFixed(1)
      : homeStatusStore.homeStatus.data.ethanol) || null;
  const heartRate =
    (healthStore.healthStatus && healthStore.healthStatus[0]?.heart_rate) ||
    null;

  console.log(dustLevel, ethanol, heartRate);
  return (
    <>
      <div id="toggle-group">
        <Toggle
          name="알림"
          identifier="notification"
          status={userProgressStore.toggleStatus.notification ? "good" : "bad"}
          onClickToggle={userProgressStore.handleToggleStatus}
          imgSrc={
            userProgressStore.toggleStatus.notification
              ? notificationOnImage
              : notificationOffImage
          }
          altSrc="notification"
        ></Toggle>
        <Toggle
          name="카메라"
          identifier="camera"
          status={userProgressStore.toggleStatus.camera ? "good" : "bad"}
          onClickToggle={userProgressStore.handleToggleStatus}
          imgSrc={cameraImage}
          altSrc="camera"
        ></Toggle>
        <Toggle
          name="마이크"
          identifier="microphone"
          status={userProgressStore.toggleStatus.microphone ? "good" : "bad"}
          onClickToggle={userProgressStore.handleToggleStatus}
          imgSrc={
            userProgressStore.toggleStatus.microphone ? micOnImage : micOffImage
          }
          altSrc="microphone"
        ></Toggle>
        <Toggle
          name="주행"
          identifier="car"
          status={userProgressStore.toggleStatus.car ? "good" : "bad"}
          onClickToggle={userProgressStore.handleToggleStatus}
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
            18 < homeStatusStore.homeStatus.data.temperature &&
            homeStatusStore.homeStatus.data.temperature < 26
              ? "good"
              : "bad"
          }
          status={`${homeStatusStore.homeStatus.data.temperature} ℃`}
        />
        <StatusToggle
          name="습도"
          imgSrc={humidityImage}
          altSrc="humidity"
          statusLevel={
            40 < homeStatusStore.homeStatus.data.humidity &&
            homeStatusStore.homeStatus.data.humidity < 70
              ? "good"
              : "bad"
          }
          status={`${homeStatusStore.homeStatus.data.humidity} %`}
        />
        <StatusToggle
          name="미세 먼지"
          imgSrc={airImage}
          altSrc="dust"
          statusLevel={
            homeStatusStore.homeStatus.data.dust_level < 40 ? "good" : "bad"
          }
          status={`${dustLevel}㎍/㎥`}
        />
        <StatusToggle
          name="가스 누출"
          imgSrc={heatImage}
          altSrc="gas"
          statusLevel={
            homeStatusStore.homeStatus.data.ethanol < 30 ? "good" : "bad"
          }
          status={`${ethanol} %`}
        />
        <StatusToggle
          name="심박"
          imgSrc={heartImage}
          altSrc="heartrate"
          statusLevel={60 < heartRate || heartRate < 120 ? "good" : "bad"}
          status={`${heartRate} bpm`}
        />
        <StatusToggle
          name="초미세 먼지"
          imgSrc={heatImage}
          altSrc="finedust"
          statusLevel={
            homeStatusStore.homeStatus.data.others.finedust < 30
              ? "good"
              : "bad"
          }
          status={`${homeStatusStore.homeStatus.data.ethanol} %`}
        />
      </div>
    </>
  );
}
