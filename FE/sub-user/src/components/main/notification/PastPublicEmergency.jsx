import "./Notification.css";

import { useContext } from "react";

import Modal from "../../modal/Modal.jsx";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";
import { EmergencyContext } from "../../../store/emergencyStore.jsx";

export default function PastPublicEmergency() {
  const userProgressStore = useContext(UserProgressContext);
  const emergencyStore = useContext(EmergencyContext);

  return (
    <Modal
      className="emergency-log-modal"
      open={userProgressStore.modalProgress === "past-public-emergency"}
      onClose={
        userProgressStore.modalProgress === "past-public-emergency"
          ? userProgressStore.handleCloseModal
          : null
      }
    >
      <h2>전체 알림 기록</h2>

      <div id="past-notifications">
        <div id="public-emergency-notifications">
          {emergencyStore.categorizedNotifications.warn
            .slice()
            .map((notification) => {
              return (
                <div
                  key={notification.index}
                  className={
                    notification.is_read
                      ? "public-emergency-notification-checked"
                      : "public-emergency-notification"
                  }
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
                    <p className="public-emergency-notification-loc">
                      {notification.description.RCPTN_RGN_NM}
                    </p>
                    <p className="public-emergency-notification-date">
                      {notification.description.CRT_DT}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="emergency-alert-modal-actions">
          <button onClick={userProgressStore.handleCloseModal}>Close</button>
        </div>
      </div>
    </Modal>
  );
}
