import "./Emergency.css";

import { useContext } from "react";

import PageContainer from "../container/PageContainer.jsx";
import EmergencyAlert from "./EmergencyAlert.jsx";
import EmergencyLog from "./EmergencyLog.jsx";

// import { UserProgressContext } from "../../../store/userProgressStore.jsx";
import { EmergencyContext } from "../../../store/emergencyStore.jsx";

export default function Emergency() {
  // const userProgressStore = useContext(UserProgressContext);
  const emergencyStore = useContext(EmergencyContext);

  return (
    <div id="emergency-main">
      <div id="emergency">
        <div id="emergency-alert">
          {emergencyStore.newCritNotifications.length > 0 ? (
            emergencyStore.newCritNotifications.map((emergencyAlert) => (
              <EmergencyAlert
                key={emergencyAlert.index}
                emergencyAlert={emergencyAlert}
                onCheckAlert={() =>
                  emergencyStore.handleReadNotification(emergencyAlert.index)
                }
              />
            ))
          ) : (
            <h3>감지된 이상이 없습니다.</h3>
          )}
        </div>
        {/* 긴급 상황 알림 기록 확인 버튼 */}

        <button
          className="log-button"
          onClick={emergencyStore.handleShowAlertLog}
        >
          이전 기록 확인
        </button>

        <EmergencyLog />
      </div>
    </div>
  );
}
