import "./Activity.css";

import PageContainer from "../container/PageContainer";

import Toggle from "../../toggle/Toggle.jsx";

import ActivityToggles from "./ActivityToggles.jsx";
import ActivityChartContainer from "./ActiviyChartContainer";
import WeeklyStats from "./WeeklyStats.jsx";

export default function Activity() {
  return (
    <div id="activity-container">
      <PageContainer title="박순자님의 건강 상태">
        <ActivityToggles />
        <ActivityChartContainer />
      </PageContainer>
      <PageContainer title="주간 건강 리포트">
        <WeeklyStats />
      </PageContainer>
    </div>
  );
}
