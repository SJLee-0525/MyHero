import "./Activity.css";

import PageContainer from "../container/PageContainer";

import Toggle from "../../toggle/Toggle.jsx";

import ActivityToggles from "./ActivityToggles.jsx";
import ActivityChartContainer from "./ActiviyChartContainer";
import WeeklyStats from "./WeeklyStats.jsx";

export default function Activity() {
  return (
    <div id="activity-container">
      <PageContainer>
        <h3>박순자님의 건강 상태</h3>
        <ActivityToggles />
        <ActivityChartContainer />
      </PageContainer>
      <PageContainer>
        <h3>주간 건강 리포트</h3>
        <WeeklyStats />
      </PageContainer>
    </div>
  );
}
