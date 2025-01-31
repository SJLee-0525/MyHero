import "./Notification.css"

import { useContext } from "react"

import { EmergencyContext } from "../../../store/emergencyStore"

export default function AllNotifications() {
  const emergencyStore = useContext(EmergencyContext)

  return (
    <div id="home-notifications">
      {/* slice()를 사용해서 원본 배열을 복사한 후 reverse()를 적용하면 원본 homeNotifications 배열이 변하지 않고 뒤집을 수 있음. */}
      {emergencyStore.homeNotifications
        .slice()
        .reverse()
        .map((notification) => {
          return (
            <div key={notification.index} className={notification.check ? "home-notification-checked" : "home-notification"}>
              {notification.notification_grade === 1 && (
                <div className="home-notification-icon-1">
                  <img src="" alt="" />
                </div>
              )}
              {notification.notification_grade === 2 && (
                <div className="home-notification-icon-2">
                  <img src="" alt="" />
                </div>
              )}
              {notification.notification_grade === 3 && (
                <div className="home-notification-icon-3">
                  <img src="" alt="" />
                </div>
              )}
              <div className="home-notification-content">
                <div className="home-notification-description">{notification.descriptions}</div>
                <div className="home-notification-date">{notification.date}</div>
              </div>
            </div>
          )
        })}
      <div className="home-notification-btn">
        <button onClick={emergencyStore.handleCheckHomeAlert}>지우기</button>
      </div>
    </div>
  )
}
