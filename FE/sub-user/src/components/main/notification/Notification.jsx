import "./Notification.css"

import PageContainer from "..//container/PageContainer.jsx"

import AllNotifications from "./AllNotifications.jsx"
import PublicEmergencyNotifications from "./PublicEmergencyNotifications.jsx"

export default function Notification() {
  return (
    <div id="notification-main">
      <div id="main-container">
        {/* <h2 id="main-container-title">notification</h2> */}
        <div id="notification-container">
          <div id="notification-elem-left">
            <PageContainer title="알림">
              <AllNotifications />
            </PageContainer>
          </div>
          <div id="notification-elem-right">
            <PageContainer title="긴급 재난 문자">
              <PublicEmergencyNotifications />
            </PageContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
