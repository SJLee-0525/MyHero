import "./Mental.css";

import { useContext } from "react";

import { HealthContext } from "../../../store/healthStore";

import MentalHealthModal from "./MentalHealthModal";

export default function MentalHealth() {
  const healthStore = useContext(HealthContext);

  return (
    <div id="mental-report">
      <div className="mental-report-header">
        <h3>정신 건강 상태 분석을 의뢰해 보세요.</h3>
        <button onClick={healthStore.handleShowMentalHealthReport}>
          분석 의뢰
        </button>
      </div>
      <MentalHealthModal />
    </div>
  );
}
