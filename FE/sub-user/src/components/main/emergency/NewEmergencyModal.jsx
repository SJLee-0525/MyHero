import "./Emergency.css";

import { useContext } from "react";

import Modal from "../../modal/Modal.jsx";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";
import { EmergencyContext } from "../../../store/emergencyStore.jsx";

// import tempImg from "/lim.png";

export default function NewEmergencyModal() {
  const userProgressStore = useContext(UserProgressContext);
  const emergencyStore = useContext(EmergencyContext);

  return (
    <Modal
      className="emergency-log-modal"
      open={emergencyStore.newCritNotifications.length > 0}
      // onClose={
      //   userProgressStore.modalProgress === "emergency-alert-log"
      //     ? userProgressStore.handleCloseModal
      //     : null
      // }
    >
      <h2>긴급 상황 발생</h2>

      <div id="emergency-alert-modal-box">
        {emergencyStore.newCritNotifications.slice().map((emergencyAlert) => {
          const createdAtKST = new Date(
            emergencyAlert.created_at
          ).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          let parsedDescription;
          try {
            parsedDescription = JSON.parse(emergencyAlert.description);
          } catch (e) {
            parsedDescription = emergencyAlert.description; // JSON 파싱 실패 시 원본 유지
          }

          // 임시 변수
          const res = false;

          return (
            <div
              key={emergencyAlert.index}
              className={res ? "alert-box-check" : "alert-box"}
            >
              <div className="title-container">
                <h1 className={res ? "common" : "no-answer-title"}>
                  123옆 공간에서 낙상 감지
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
                  <span className={res ? "check" : "no-answer"}>
                    {res ? <strong>확인</strong> : <strong>미확인</strong>}
                  </span>
                </p>
              </div>

              {/* 이미지 출력단 */}
              <div>
                <img src="" alt="temp" />
              </div>
              <div className="widget-button-container">
                {!res && (
                  <div className="widget-button-container">
                    <button
                      className="report"
                      onClick={() =>
                        emergencyStore.handleReadNotification(
                          emergencyAlert.index
                        )
                      }
                    >
                      신고 요청 보내기
                    </button>
                    <button
                      className="call"
                      onClick={() =>
                        emergencyStore.handleReadNotification(
                          emergencyAlert.index
                        )
                      }
                    >
                      전화 연결
                    </button>
                  </div>
                )}
                {res && (
                  <div className="widget-button-container">
                    <button
                      className="call"
                      onClick={() =>
                        emergencyStore.handleReadNotification(
                          emergencyAlert.index
                        )
                      }
                    >
                      전화 연결
                    </button>
                    <button
                      className="close"
                      onClick={() =>
                        emergencyStore.handleReadNotification(
                          emergencyAlert.index
                        )
                      }
                    >
                      닫기
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
