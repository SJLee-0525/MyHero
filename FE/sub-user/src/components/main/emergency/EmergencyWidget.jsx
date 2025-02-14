import "./Emergency.css";

import { useContext } from "react";

import EmergencyWidgetAlert from "./EmergencyWidgetAlert.jsx";
import EmergencyLog from "./EmergencyLog.jsx";

// import { UserProgressContext } from "../../../store/userProgressStore.jsx";
import { EmergencyContext } from "../../../store/emergencyStore.jsx";

export default function EmergencyWidget() {
  // const userProgressStore = useContext(UserProgressContext);
  const emergencyStore = useContext(EmergencyContext);

  return (
    <div>
      <div id="emergency-alert-widget">
        {emergencyStore.allNotifications.length > 0 ? (
          emergencyStore.allNotifications.map((notification) => (
            <EmergencyWidgetAlert
              key={notification.index}
              notification={notification}
            />
          ))
        ) : (
          <h3>기록된 알림이 없습니다.</h3>
        )}
      </div>

      {/* <div id="emergency-widget-log">
        <button
          className="log-widget-button"
          onClick={emergencyStore.handleShowAlertLog}
        >
          이전 기록 확인
        </button>
      </div> */}
      <EmergencyLog />
    </div>
  );
}
