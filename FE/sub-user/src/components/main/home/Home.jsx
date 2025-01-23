import "../Main.css";

import { useContext } from "react";

import Widget from "../../widget/Widget.jsx";
import Toggle from "../../toggle/Toggle.jsx";

import CalendarWidget from "../calendar/CalendarWidget.jsx";
import EmergencyWidget from "../emergency/EmergencyWidget.jsx";
import KeywordsWidget from "../mental/KeywordsWidget.jsx";

import notificationOnImage from "../../../assets/icons/notification.svg";
import notificationOffImage from "../../../assets/icons/notification_off.svg";
import carImage from "../../../assets/icons/car.svg";
import cameraImage from "../../../assets/icons/camera.svg";
import micOnImage from "../../../assets/icons/mic_on.svg";
import micOffImage from "../../../assets/icons/mic_off.svg";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

export default function Main() {
  const userProgressStore = useContext(UserProgressContext);

  const contents = ["임영웅", "김치찌개", "두부", "여행", "병원"];
  const colors = [
    ["#146152", "white"],
    ["#44803F", "white"],
    ["#B4CF66", "black"],
    ["#FFEC5C", "black"],
    ["#FF5A33", "white"],
  ];

  return (
    <div>
      <h2 id="main-container-title">HOME</h2>

      <div id="page-container">
        <Widget title="긴급 상황 알림" type="emergency">
          <EmergencyWidget />
        </Widget>
        <Widget title="캘린더" type="calendar">
          <CalendarWidget />
        </Widget>
        <Widget title="박순자님의 집">
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
                userProgressStore.toggleStatus.microphone
                  ? micOnImage
                  : micOffImage
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
          </div>
        </Widget>
        <KeywordsWidget />
      </div>
    </div>
  );
}
