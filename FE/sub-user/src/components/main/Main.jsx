import "./Main.css"

import { useContext } from "react"

import Widget from "../widget/Widget.jsx"
import Toggle from "../toggle/Toggle.jsx"

import notificationOnImage from "../../assets/icons/notification_active.svg"
import notificationOffImage from "../../assets/icons/notification_off.svg"
import carImage from "../../assets/icons/car.svg"
import cameraImage from "../../assets/icons/camera.svg"
import micOnImage from "../../assets/icons/mic_on.svg"
import micOffImage from "../../assets/icons/mic_off.svg"

import heartImage from "../../assets/side-heart.png"
import settingImage from "../../assets/side-setting.png"

import { MainStoreContext } from "../../store/mainStore.jsx"

export default function Main() {
  const mainStore = useContext(MainStoreContext)

  const contents = ["임영웅", "김치찌개", "두부", "여행", "병원"]
  const colors = [
    ["#146152", "white"],
    ["#44803F", "white"],
    ["#B4CF66", "black"],
    ["#FFEC5C", "black"],
    ["#FF5A33", "white"],
  ]

  return (
    <div id="page-container">
      <Widget title="박순자님의 집">
        <div id="toggle-group">
          <Toggle
            name="notification"
            status={mainStore.toggleStatus.notification}
            onClickToggle={mainStore.handleToggleStatus}
            imgSrc={mainStore.toggleStatus.notification ? notificationOnImage : notificationOffImage}
            altSrc="notification"
          ></Toggle>
          <Toggle name="camera" status={mainStore.toggleStatus.camera} onClickToggle={mainStore.handleToggleStatus} imgSrc={cameraImage} altSrc="camera"></Toggle>
          <Toggle
            name="microphone"
            status={mainStore.toggleStatus.microphone}
            onClickToggle={mainStore.handleToggleStatus}
            imgSrc={mainStore.toggleStatus.microphone ? micOnImage : micOffImage}
            altSrc="microphone"
          ></Toggle>
          <Toggle name="car" status={mainStore.toggleStatus.car} onClickToggle={mainStore.handleToggleStatus} imgSrc={carImage} altSrc="car"></Toggle>
        </div>
      </Widget>
      <Widget title="오늘 박순자님의 대화 키워드" type="keyword">
        {contents.map((content, index) => {
          return (
            <span
              key={index}
              id="content-box"
              style={{
                backgroundColor: colors[index % colors.length][0],
                color: colors[index % colors.length][1],
              }}
            >
              {content}
            </span>
          )
        })}
      </Widget>
    </div>
  )
}
