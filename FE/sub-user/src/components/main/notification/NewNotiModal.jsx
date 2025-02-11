import "./Notification.css";

import { useContext } from "react";

import { EmergencyContext } from "../../../store/emergencyStore.jsx";

import Modal from "../../modal/Modal.jsx";

export default function NewNotiModal() {
  const emergencyStore = useContext(EmergencyContext);

  return (
    <Modal
      open={emergencyStore.newNotifications.length > 0}
      onClose={
        emergencyStore.newNotifications.length > 0
          ? emergencyStore.handleClearNewNotifications
          : null
      }
    >
      <div id="modal-notifications">
        <div id="home-notifications">
          {emergencyStore.newNotifications.slice().map((notification) => {
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
        </div>{" "}
        <div className="emergency-alert-modal-actions">
          <button onClick={emergencyStore.handleClearNewNotifications}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
