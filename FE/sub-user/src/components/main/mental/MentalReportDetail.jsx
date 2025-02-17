import "./Mental.css";

import { useContext } from "react";

import { HealthContext } from "../../../store/healthStore";
import { UserProgressContext } from "../../../store/userProgressStore";

import Modal from "../../modal/Modal";

function TimeBasedEmotions({ emotions }) {
  if (!emotions) {
    return null;
  }

  return (
    <div>
      <h3 className="detail-report-subtitle">주요 시간대별 감정 상태</h3>
      <table className="emotion-detail-table">
        <thead>
          <tr>
            <th width="8%">시간</th>
            <th width="15%">상태</th>
            <th width="8%">점수</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(emotions).map(
            ([time, [emotion, percentage, description]]) => {
              let emotionClass = "";
              if (emotion === "매우 긍정적") {
                emotionClass = "very-positive";
              } else if (emotion === "긍정적") {
                emotionClass = "positive";
              } else if (emotion === "중립적") {
                emotionClass = "neutral";
              } else if (emotion === "부정적") {
                emotionClass = "negative";
              } else if (emotion === "매우 부정적") {
                emotionClass = "very-negative";
              }

              return (
                <tr key={time}>
                  <td>
                    <strong>{time}</strong>
                  </td>
                  <td>
                    <span className={emotionClass}>
                      <strong>{emotion}</strong>
                    </span>
                  </td>
                  <td>{percentage}%</td>
                  <td>
                    <em>{description}</em>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}

function Recommendations({ recommendations }) {
  if (!recommendations) {
    return;
  }

  return (
    <div>
      <h3 className="detail-report-subtitle">추천</h3>
      <ul className="report-recommendations-ul">
        {recommendations.map((recommendation) => {
          return <li key={recommendation}>{recommendation}</li>;
        })}
      </ul>
    </div>
  );
}

export default function MentalReportDetail() {
  const healthStore = useContext(HealthContext);
  const userProgressStore = useContext(UserProgressContext);

  const reportIndex = userProgressStore.selectedModalId;

  const report =
    healthStore.mentalStatus.length > 0
      ? healthStore.mentalStatus[reportIndex]
      : null;

  const reportedAt = report
    ? new Date(report.reported_at + "Z") // UTC-0 기준 명시
        .toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          // second: "2-digit",
          hour12: true,
        })
    : null;

  const mainUserName = "박순자123";

  return (
    <Modal
      open={userProgressStore.modalProgress === "detail-mental-report"}
      onClose={
        userProgressStore.modalProgress === "detail-mental-report"
          ? userProgressStore.handleCloseModal
          : null
      }
    >
      <h1 className="detail-report-title">
        {mainUserName}님의 감정 상태 상세 보고서
      </h1>
      <p className="detail-report-date">
        {reportedAt ? reportedAt : null} 발행
      </p>
      <br />
      <h3 className="detail-report-overall">
        {report ? report.description.overall_emotional_state : null}
      </h3>
      <p className="detail-report-insights">
        {report ? report.description.emotional_insights : null}
      </p>

      <hr />
      <TimeBasedEmotions
        emotions={report ? report.description.time_based_emotions : null}
      />

      <hr />
      <Recommendations
        recommendations={report ? report.description.recommendations : null}
      />
      <div className="emergency-alert-modal-actions">
        <button onClick={userProgressStore.handleCloseModal}>닫기</button>
      </div>
    </Modal>
  );
}
