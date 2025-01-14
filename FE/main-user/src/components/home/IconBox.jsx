import "./Home.css";

import { useContext } from "react";

import messageIcon from "../../assets/message.png";
import emergencyIcon from "../../assets/emergency.png";

import Icon from "./Icon.jsx";

import { StoreContext } from "../../store/store.jsx";

export default function IconBox() {
  const store = useContext(StoreContext);

  return (
    <div id="icon-box">
      <Icon
        type="icon"
        imgSrc={messageIcon}
        altSrc="message-icon"
        onClickIcon={store.handleMessageState}
      >
        Message
      </Icon>
      <Icon
        type="icon"
        imgSrc={emergencyIcon}
        altSrc="emergency-alert"
        onClickIcon={store.handleEmergencyState}
      >
        Emergency Alert
      </Icon>
    </div>
  );
}
