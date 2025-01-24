import "./Activity.css";

import PageContainer from "../container/PageContainer";

import Toggle from "../../toggle/Toggle.jsx";

import ActivityToggles from "./ActivityToggles.jsx";
import ActivityChartContainer from "./ActiviyChartContainer";
import WeeklyStats from "./WeeklyStats.jsx";

export default function Activity() {
  const mainUserName = "박순자123";

  return (
    <div id="activity-main">
      <div id="main-container">
        {/* <h2 id="main-container-title">ACTIVITY</h2> */}
        <div id="activity-container">
          <div id="activity-elem-left">
            <PageContainer title={`${mainUserName}님의 건강 상태`}>
              <ActivityToggles />
              <ActivityChartContainer />
            </PageContainer>
          </div>
          <div id="activity-elem-right">
            <PageContainer title="주간 건강 리포트">
              <WeeklyStats />
            </PageContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
