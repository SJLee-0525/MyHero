import "./Mental.css";

import { useContext } from "react";

import { HealthContext } from "../../../store/healthStore";

import MentalReportDetail from "./MentalReportDetail";

export default function MentalReport() {
  const healthStore = useContext(HealthContext);

  const report =
    healthStore.mentalStatus && healthStore.mentalStatus.length > 0
      ? healthStore.mentalStatus[0]
      : null;

  const mainUserName = "박순자123";

  return (
    <div id="mental-report">
      <h3>
        {report ? report.reported_at.slice(0, 10) : null} {mainUserName}씨 감정
        상태 보고서
      </h3>
      <div className="mental-report-overall">
        <h3 className="mental-report-subtitle">전반적 통찰 상태</h3>
        <p>{report ? report.description.overall_emotional_state : null}</p>
      </div>
      <div className="mental-report-recommendation">
        <h3 className="mental-report-subtitle">권고 사항</h3>
        <ol>
          {report &&
            report.description.recommendations.map((recommendation) => {
              return <li key={recommendation}>{recommendation}</li>;
            })}
        </ol>
      </div>
      <div>
        <button
          className="detail-report-btn"
          onClick={healthStore.handleShowDetailReport}
        >
          상세 보고서 보기
        </button>
      </div>
      <MentalReportDetail />
    </div>
  );
}
