import { useState } from "react"; //
import "./Home.css"; //

import { useContext } from "react";
import { StoreContext } from "../../store/store.jsx";

import alertIcon from "../../assets/alert.png";
import cameraIcon from "../../assets/camera.png";
import carIcon from "../../assets/car.png";
import micIcon from "../../assets/microphone.png";

import Icon from "./Icon.jsx";

export default function Dock() {
  const store = useContext(StoreContext);
  const [clickedIcon, setClickedIcon] = useState(null); //

  // 클릭 시 애니메이션 추가
  const handleClick = (iconType, onClickFunction) => {
    setClickedIcon(iconType);
    setTimeout(() => setClickedIcon(null), 200); // 0.2초 후 원래 상태로 복귀
    onClickFunction();
  };

  return (
    <div id="dock">
      <Icon
        type="dock-icon"
        state={store.alertState}
        imgSrc={alertIcon}
        altSrc="alert"
        // onClickIcon={store.handleAlertState}
        onClickIcon={() => handleClick("alert", store.handleAlertState)}
        clicked={clickedIcon === "alert"}
        disabled={!store.alertState}
      />
      <Icon
        type="dock-icon"
        state={store.cameraState}
        imgSrc={cameraIcon}
        altSrc="camera"
        // onClickIcon={store.handleCameraState}
        onClickIcon={() => handleClick("camera", store.handleCameraState)}
        clicked={clickedIcon === "camera"}
        disabled={!store.cameraState}
      />
      <Icon
        type="dock-icon"
        state={store.driveState}
        imgSrc={carIcon}
        altSrc="car"
        // onClickIcon={store.handleDriveState}
        onClickIcon={() => handleClick("car", store.handleDriveState)}
        clicked={clickedIcon === "car"}
        disabled={!store.driveState}
      />
      <Icon
        type="dock-icon"
        state={store.micState}
        imgSrc={micIcon}
        altSrc="microphone"
        // onClickIcon={store.handleMicState}
        onClickIcon={() => handleClick("mic", store.handleMicState)}
        clicked={clickedIcon === "mic"}
        disabled={!store.micState}
      />
    </div>
  );
}