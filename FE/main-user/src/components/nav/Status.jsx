import { useContext } from "react";

import { StoreContext } from "../../store/store.jsx";

import StatusIcon from "./StatusIcon.jsx";

import batteryIconCharge from "../../assets/aside/side-battery-charge.png";
import notificationIcon from "../../assets/aside/side-notification.png";
import settingIcon from "../../assets/aside/side-setting.png";
import heartIcon from "../../assets/aside/side-heart.png";

export default function Status() {
  const store = useContext(StoreContext);

  return (
    <div id="status-bar">
      <StatusIcon
        imgSrc={notificationIcon}
        altSrc="notification-icon"
        status={store.openNotificationState}
        onClickIcon={store.handleNotificationState}
      />
      <StatusIcon
        imgSrc={heartIcon}
        altSrc="heart-icon"
        status={store.openHealthState}
        onClickIcon={store.handleHealthState}
      />
      {/* <StatusIcon imgSrc={wifiIcon} altSrc="wifi-icon-100" /> */}
      <StatusIcon imgSrc={batteryIconCharge} altSrc="battery-icon-charge" />
      <StatusIcon
        imgSrc={settingIcon}
        altSrc="setting-icon"
        status={store.openSettingState}
        onClickIcon={store.handleSettingState}
      />
    </div>
  );
}
