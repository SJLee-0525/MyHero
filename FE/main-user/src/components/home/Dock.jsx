import { useState } from "react"; //
import "./Home.css"; //

import { useSettingStore } from "../../store/settingStore.jsx";

import alertIcon from "../../assets/alert.png";
import cameraIcon from "../../assets/camera.png";
import carIcon from "../../assets/car.png";
import micIcon from "../../assets/microphone.png";

import Icon from "./Icon.jsx";

export default function Dock() {
  const { alertState, cameraState, driveState, micState, toggleFeature } = useSettingStore();
  const [clickedIcon, setClickedIcon] = useState(null);

  // 클릭 시 애니메이션 추가
  const handleClick = (iconType, featureKey) => {
    setClickedIcon(iconType);
    setTimeout(() => setClickedIcon(null), 200); // 0.2초 후 원래 상태로 복귀
    toggleFeature(featureKey);
  };

  return (
    <div id="dock">
      <Icon
        type="dock-icon"
        state={alertState}
        imgSrc={alertIcon}
        altSrc="alert"
        onClickIcon={() => handleClick("alert", "alertState")}
        clicked={clickedIcon === "alert"}
        disabled={!alertState}
      />
      <Icon
        type="dock-icon"
        state={cameraState}
        imgSrc={cameraIcon}
        altSrc="camera"
        onClickIcon={() => handleClick("camera", "cameraState")}
        clicked={clickedIcon === "camera"}
        disabled={!cameraState}
      />
      <Icon
        type="dock-icon"
        state={driveState}
        imgSrc={carIcon}
        altSrc="car"
        onClickIcon={() => handleClick("car", "driveState")}
        clicked={clickedIcon === "car"}
        disabled={!driveState}
      />
      <Icon
        type="dock-icon"
        state={micState}
        imgSrc={micIcon}
        altSrc="microphone"
        onClickIcon={() => handleClick("mic", "micState")}
        clicked={clickedIcon === "mic"}
        disabled={!micState}
      />
    </div>
  );
}