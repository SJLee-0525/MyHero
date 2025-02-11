import "./Notification.css";

import { useContext } from "react";

import Modal from "../../modal/Modal.jsx";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";
import { EmergencyContext } from "../../../store/emergencyStore.jsx";

// import tempImg from "/lim.png";

export default function PastNotifications() {
  const userProgressStore = useContext(UserProgressContext);
  const emergencyStore = useContext(EmergencyContext);

  return (
    <Modal
      className="emergency-log-modal"
      open={userProgressStore.modalProgress === "past-notifications"}
      onClose={
        userProgressStore.modalProgress === "past-notifications"
          ? userProgressStore.handleCloseModal
          : null
      }
    >
      <h2>전체 알림 기록</h2>

      <div id="past-notifications">
        <div id="home-notifications">
          {emergencyStore.categorizedNotifications.info
            .slice()
            .map((notification) => {
              // UTC+9 변환
              const createdAtKST = new Date(
                notification.created_at
              ).toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, // 24시간제
              });

              return (
                <div
                  key={notification.index}
                  className={
                    notification.is_read
                      ? "home-notification-checked"
                      : "home-notification"
                  }
                >
                  <div className="home-notification-icon-1">
                    <img src="" alt="" />
                  </div>
                  <div className="home-notification-content">
                    <div className="home-notification-description">
                      {notification.description}
                    </div>
                    <div className="home-notification-date">{createdAtKST}</div>
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
