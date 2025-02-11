import "./Notification.css";

import { useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore";
import { EmergencyContext } from "../../../store/emergencyStore";

export default function PublicEmergencyNotifications() {
  const userProgressStore = useContext(UserProgressContext);
  const emergencyStore = useContext(EmergencyContext);

  function handleReadNotification(index) {
    emergencyStore.handleReadNotification(index);
  }

  return (
    <div id="public-emergency-notifications-container">
      <div id="public-emergency-notifications">
        {emergencyStore.categorizedNotifications.warn
          .slice()
          .filter((notification) => !notification.is_read)
          .map((notification) => {
            return (
              <button
                className="public-emergency-notification-btn"
                key={notification.index}
                onClick={() => handleReadNotification(notification.index)}
              >
                <div
                  className="public-emergency-notification"
                  key={notification.index}
                >
                  <div className="public-emergency-notification-header">
                    <h2>{notification.description.DST_SE_NM}</h2>
                    <p>{notification.description.EMRG_STEP_NM}</p>
                  </div>
                  <div className="public-emergency-notification-content">
                    <div className="public-emergency-notification-description">
                      {notification.description.MSG_CN}
                    </div>
                  </div>
                  <div className="public-emergency-notification-footer">
                    {/* <p className="public-emergency-notification-loc">
                      {notification.description.RCPTN_RGN_NM}
                    </p> */}
                    <p className="public-emergency-notification-date">
                      {notification.description.CRT_DT}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
      </div>
      <div className="public-emergency-notification-btn">
        <button
          onClick={() =>
            userProgressStore.handleOpenModal("past-public-emergency")
          }
        >
          지난 재난 문자 보기
        </button>
      </div>
    </div>
  );
}
