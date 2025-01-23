import "./Toggle.css";

import { useContext } from "react";

import { UserProgressContext } from "../../store/userProgressStore";
import { HomeStatusContext } from "../../store/homeStatusStore";

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

export default function ToggleGroup() {
  const userProgressStore = useContext(UserProgressContext);
  const homeStatusStore = useContext(HomeStatusContext);

  return (
    <div id="toggle-group">
      <Toggle
        name="notification"
        status={userProgressStore.toggleStatus.notification}
        onClickToggle={userProgressStore.handleToggleStatus}
        imgSrc={
          userProgressStore.toggleStatus.notification
            ? notificationOnImage
            : notificationOffImage
        }
        altSrc="notification"
      ></Toggle>
      <Toggle
        name="camera"
        status={userProgressStore.toggleStatus.camera}
        onClickToggle={userProgressStore.handleToggleStatus}
        imgSrc={cameraImage}
        altSrc="camera"
      ></Toggle>
      <Toggle
        name="microphone"
        status={userProgressStore.toggleStatus.microphone}
        onClickToggle={userProgressStore.handleToggleStatus}
        imgSrc={
          userProgressStore.toggleStatus.microphone ? micOnImage : micOffImage
        }
        altSrc="microphone"
      ></Toggle>
      <Toggle
        name="car"
        status={userProgressStore.toggleStatus.car}
        onClickToggle={userProgressStore.handleToggleStatus}
        imgSrc={carImage}
        altSrc="car"
      ></Toggle>

      <StatusToggle
        name="온도"
        imgSrc={thermostatImage}
        altSrc="heart"
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
        altSrc="heart"
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
        imgSrc={humidityImage}
        altSrc="heart"
        statusLevel={
          homeStatusStore.homeStatus.data.dust_level < 40 ? "good" : "bad"
        }
        status={`${homeStatusStore.homeStatus.data.dust_level} ㎍/㎥`}
      />
      <StatusToggle
        name="가스 누출"
        imgSrc={heatImage}
        altSrc="heart"
        statusLevel={
          homeStatusStore.homeStatus.data.dust_level < 30 ? "good" : "bad"
        }
        status={`${homeStatusStore.homeStatus.data.ethanol} %`}
      />
    </div>
  );
}
