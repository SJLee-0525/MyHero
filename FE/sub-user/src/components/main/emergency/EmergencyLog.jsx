import { useContext } from "react"

import Modal from "../../modal/Modal.jsx"

import { UserProgressContext } from "../../../store/userProgressStore.jsx"

export default function EmergencyLog({ emergencyAlerts }) {
  const userProgressStore = useContext(UserProgressContext)

  return (
    <Modal
      className="emergency-log-modal"
      open={userProgressStore.modalProgress === "emergency-alert-log"}
      onClose={userProgressStore.modalProgress === "emergency-alert-log" ? userProgressStore.handleCloseModal : null}
    >
      <h2>긴급 상황 알림 기록</h2>

      <div id="emergency-alert-modal-box">
        {emergencyAlerts.map((emergencyAlert, index) => {
          const res = emergencyAlert.response
          const callRes = emergencyAlert.check

          return (
            <div>
              <hr />
              <div className="title-container">
                <h1 className={res ? "common" : "no-answer"}>{emergencyAlert.location}옆 공간에서 낙상 감지</h1>
                <p className="date">{emergencyAlert.date}</p>
              </div>
              <p>
                <strong>낙상 확인 여부 : </strong>
                <span className={res ? "check" : "no-answer"}>{res ? <strong>오인으로 응답하였습니다.</strong> : <strong>응답 없음</strong>}</span>
              </p>
              <p>
                <strong>확인 여부 : </strong>
                <span className={callRes ? "check" : "no-answer"}>{callRes ? <strong>확인됨.</strong> : <strong>확인되지 않음.</strong>}</span>
              </p>
            </div>
          )
        })}
      </div>

      <div className="emergency-alert-modal-actions">
        <button onClick={userProgressStore.handleCloseModal}>Close</button>
      </div>
    </Modal>
  )
}
