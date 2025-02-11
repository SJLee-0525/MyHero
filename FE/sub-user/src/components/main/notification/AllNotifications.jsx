import "./Notification.css";

import { useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore";
import { EmergencyContext } from "../../../store/emergencyStore";

export default function AllNotifications() {
  const userProgressStore = useContext(UserProgressContext);
  const emergencyStore = useContext(EmergencyContext);

  async function handleReadNotification(index) {
    const response = await emergencyStore.handleReadNotification(index);
  }

  return (
    <div id="all-notifications">
      <div id="home-notifications">
        {emergencyStore.categorizedNotifications.info
          .slice()
          .filter((notification) => !notification.is_read) // is_read가 false인 항목만 남김
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
              <button
                className="notification-btn"
                key={notification.index}
                onClick={() => handleReadNotification(notification.index)}
              >
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
              </button>
            );
          })}
      </div>

      <div className="home-notification-btn">
        <button
          onClick={() =>
            userProgressStore.handleOpenModal("past-notifications")
          }
        >
          지난 알림 보기
        </button>
      </div>
    </div>
  );
}
