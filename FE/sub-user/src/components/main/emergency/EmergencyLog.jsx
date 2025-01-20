import { useContext } from "react";

import Modal from "../../modal/Modal.jsx";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";
import { EmergencyContext } from "../../../store/emergencyStore.jsx";

import tempImg from "/lim.png";

export default function EmergencyLog() {
  const userProgressStore = useContext(UserProgressContext);
  const emergencyStore = useContext(EmergencyContext);

  return (
    <Modal
      className="emergency-log-modal"
      open={userProgressStore.modalProgress === "emergency-alert-log"}
      onClose={
        userProgressStore.modalProgress === "emergency-alert-log"
          ? userProgressStore.handleCloseModal
          : null
      }
    >
      <h2>긴급 상황 알림 기록</h2>

      <div id="emergency-alert-modal-box">
        {emergencyStore.emergencyAlerts.map((emergencyAlert, index) => {
          const res = emergencyAlert.response;
          const callRes = emergencyAlert.check;

          return (
            <div
              key={emergencyAlert.id}
              className={callRes ? "alert-box-check" : "alert-box"}
            >
              <div className="title-container">
                <h1 className={res ? "common" : "no-answer-title"}>
                  {emergencyAlert.location}옆 공간에서 낙상 감지
                </h1>
              </div>
              <p className="date">{emergencyAlert.date}</p>
              <div>
                <p>
                  <strong>낙상 확인 여부 : </strong>
                  <span className={res ? "check" : "no-answer"}>
                    {res ? (
                      <strong>오인 응답</strong>
                    ) : (
                      <strong>응답 없음</strong>
                    )}
                  </span>
                </p>
                <p>
                  <strong>확인 여부 : </strong>
                  <span className={callRes ? "check" : "no-answer"}>
                    {callRes ? <strong>확인</strong> : <strong>미확인</strong>}
                  </span>
                </p>
              </div>
              <div>
                <img src={emergencyAlert.imgSrc} alt="temp" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="emergency-alert-modal-actions">
        <button onClick={userProgressStore.handleCloseModal}>Close</button>
      </div>
    </Modal>
  );
}
