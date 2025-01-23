import "./Mental.css";

import { useContext } from "react";

import { HealthContext } from "../../../store/healthStore";
import { UserProgressContext } from "../../../store/userProgressStore";

import Modal from "../../modal/Modal";

function TimeBasedEmotions({ emotions }) {
  return (
    <div>
      <h3 className="detail-report-subtitle">주요 시간대별 감정 상태</h3>
      <table className="emotion-detail-table">
        <th width="8%">시간</th>
        <th width="15%">상태</th>
        <th width="8%">점수</th>
        <th>설명</th>
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
      </table>
    </div>
  );
}

function Recommendations({ recommendations }) {
  return (
    <div>
      <h3 className="detail-report-subtitle">추천</h3>
      <ul className="report-recommendations-ul">
        {recommendations.map((recommendation) => {
          return <li>{recommendation}</li>;
        })}
      </ul>
    </div>
  );
}

export default function MentalReportDetail() {
  const healthStore = useContext(HealthContext);
  const userProgressStore = useContext(UserProgressContext);

  const report = healthStore.mentalReport.data[0];

  return (
    <Modal
      open={userProgressStore.modalProgress === "detail-mental-report"}
      onClose={
        userProgressStore.modalProgress === "detail-mental-report"
          ? userProgressStore.handleCloseModal
          : null
      }
    >
      <h1 className="detail-report-title">박순자님의 감정 상태 상세 보고서</h1>
      <p className="detail-report-date">{report.created_at} 발행</p>
      <br />
      <h3 className="detail-report-overall">
        {report.report_content.overall_emotional_state}
      </h3>
      <p className="detail-report-insights">
        {report.report_content.emotional_insights}
      </p>

      <hr />
      <TimeBasedEmotions emotions={report.report_content.time_based_emotions} />

      <hr />
      <Recommendations
        recommendations={report.report_content.recommendations}
      />
      <div className="emergency-alert-modal-actions">
        <button onClick={userProgressStore.handleCloseModal}>Close</button>
      </div>
    </Modal>
  );
}
