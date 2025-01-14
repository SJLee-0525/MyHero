import "./Home.css";

import { useContext } from "react";

import { StoreContext } from "../../store/store.jsx";

import alertIcon from "../../assets/alert.png";
import cameraIcon from "../../assets/camera.png";
import carIcon from "../../assets/car.png";
import micIcon from "../../assets/microphone.png";

import Icon from "./Icon.jsx";

export default function Dock() {
  const store = useContext(StoreContext);

  return (
    <div id="dock">
      <Icon
        type="dock-icon"
        state={store.alertState}
        imgSrc={alertIcon}
        altSrc="alert"
        onClickIcon={store.handleAlertState}
      />
      <Icon
        type="dock-icon"
        state={store.cameraState}
        imgSrc={cameraIcon}
        altSrc="camera"
        onClickIcon={store.handleCameraState}
      />
      <Icon
        type="dock-icon"
        state={store.driveState}
        imgSrc={carIcon}
        altSrc="car"
        onClickIcon={store.handleDriveState}
      />
      <Icon
        type="dock-icon"
        state={store.micState}
        imgSrc={micIcon}
        altSrc="microphone"
        onClickIcon={store.handleMicState}
      />
    </div>
  );
}
