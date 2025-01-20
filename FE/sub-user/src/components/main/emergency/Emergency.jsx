import "./Emergency.css";

import { useState, useContext } from "react";

import PageContainer from "../container/PageContainer.jsx";
import EmergencyAlert from "./EmergencyAlert.jsx";
import EmergencyLog from "./EmergencyLog.jsx";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

export default function Emergency() {
  const userProgressStore = useContext(UserProgressContext);

  const [emergencyAlerts, setEmergencyAlerts] = useState([
    {
      id: 1,
      location: "거실",
      type: "낙상",
      response: false,
      date: "2025/01/20 11:12:51",
      check: false,
    },
    {
      id: 2,
      location: "거실",
      type: "낙상",
      response: true,
      date: "2025/01/20 11:16:51",
      check: false,
    },
    {
      id: 3,
      location: "거실",
      type: "낙상",
      response: false,
      date: "2025/01/20 11:12:51",
      check: true,
    },
    {
      id: 4,
      location: "거실",
      type: "낙상",
      response: true,
      date: "2025/01/20 11:16:51",
      check: true,
    },
    {
      id: 5,
      location: "거실",
      type: "낙상",
      response: false,
      date: "2025/01/20 11:12:51",
      check: true,
    },
    {
      id: 6,
      location: "거실",
      type: "낙상",
      response: true,
      date: "2025/01/20 11:16:51",
      check: true,
    },
  ]);

  // 한 번 확인하면 이전의 알림은 전부 읽음 처리.
  function handleCheckAlert() {
    return setEmergencyAlerts((prevAlerts) => {
      return prevAlerts.map((prevAlert) => {
        return {
          ...prevAlert,
          check: true,
        };
      });
    });
  }

  function handleShowAlertLog() {
    userProgressStore.handleOpenModal("emergency-alert-log");
  }

  console.log(emergencyAlerts);
  return (
    <div>
      <PageContainer title="긴급 상황 알림">
        <div id="emergency-alert">
          {/* check가 false인 알림을 찾으면 그 알림을 출력하고 중단. some이나 every는 boolean값을 반환하기에 이 목적으로 사용하기 적합하지 않음.. */}
          {(() => {
            const firstUncheckedAlert = emergencyAlerts.find(
              (alert) => !alert.check
            );
            return firstUncheckedAlert ? (
              <EmergencyAlert
                key={firstUncheckedAlert.id}
                emergencyAlert={firstUncheckedAlert}
                onCheckAlert={handleCheckAlert}
              />
            ) : (
              <h3>감지된 이상이 없습니다.</h3>
            );
          })()}
        </div>
      </PageContainer>
      <div id="emergency-log">
        <button className="log-button" onClick={handleShowAlertLog}>
          이전 기록 확인
        </button>
      </div>
      <EmergencyLog emergencyAlerts={emergencyAlerts} />
    </div>
  );
}
