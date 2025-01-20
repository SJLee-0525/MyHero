import "./Emergency.css";

import { useState, useContext } from "react";

import EmergencyWidgetAlert from "./EmergencyWidgetAlert.jsx";
import EmergencyLog from "./EmergencyLog.jsx";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";
import { EmergencyContext } from "../../../store/emergencyStore.jsx";

export default function EmergencyWidget() {
  const userProgressStore = useContext(UserProgressContext);
  const emergencyStore = useContext(EmergencyContext);

  return (
    <>
      <div id="emergency-alert">
        {/* check가 false인 알림을 찾으면 그 알림을 출력하고 중단. some이나 every는 boolean값을 반환하기에 이 목적으로 사용하기 적합하지 않음.. */}
        {(() => {
          const firstUncheckedAlert = emergencyStore.emergencyAlerts.find(
            (alert) => !alert.check
          );
          return firstUncheckedAlert ? (
            <EmergencyWidgetAlert
              key={firstUncheckedAlert.id}
              emergencyAlert={firstUncheckedAlert}
              onCheckAlert={emergencyStore.handleCheckAlert}
            />
          ) : (
            <h3>감지된 이상이 없습니다.</h3>
          );
        })()}
      </div>
      <div id="emergency-widget-log">
        <button
          className="log-widget-button"
          onClick={emergencyStore.handleShowAlertLog}
        >
          이전 기록 확인
        </button>
      </div>
      <EmergencyLog />
    </>
  );
}
