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
      <h2 id="main-container-title">알림</h2>

      <div id="notification-container">
        <AllNotifications />
        <PublicEmergencyNotifications />
        <Emergency />
      </div>

      <PastNotifications />
      <PastPublicEmergency />
    </div>
  );
}
