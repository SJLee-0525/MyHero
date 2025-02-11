import "./Notification.css";

import PageContainer from "../container/PageContainer.jsx";

import AllNotifications from "./AllNotifications.jsx";
import PublicEmergencyNotifications from "./PublicEmergencyNotifications.jsx";
import Emergency from "../emergency/Emergency.jsx";

import PastNotifications from "./PastNotifications.jsx";
import PastPublicEmergency from "./PastPublicEmergency.jsx";

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
            <PageContainer title="긴급 재난 문자">
              <PublicEmergencyNotifications />
            </PageContainer>
          </div>
          <div id="notification-elem-right">
            <PageContainer title="긴급 상황 알림">
              <Emergency />
            </PageContainer>
          </div>
        </div>
      </div>
      <PastNotifications />
      <PastPublicEmergency />
    </div>
  );
}
