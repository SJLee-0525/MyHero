import "./Activity.css";

import { useContext } from "react";

import { HealthContext } from "../../../store/healthStore.jsx";

import PageContainer from "../container/PageContainer";

import ActivityToggles from "./ActivityToggles.jsx";
import ActivityChartContainer from "./ActiviyChartContainer";
import MentalChartContainer from "../mental/MentalChartContainer.jsx";
import WeeklyStats from "./WeeklyStats.jsx";
import MentalReport from "../mental/MentalReport.jsx";
import Keywords from "../mental/Keywords.jsx";

export default function Activity() {
  const healthStore = useContext(HealthContext);

  const mainUserName = "박순자123";

  return (
    <div id="activity-main">
      <div id="main-container">
        {/* <h2 id="main-container-title">ACTIVITY</h2> */}
        <div id="activity-container">
          <div id="activity-elem-left">
            <PageContainer title={`${mainUserName}님의 건강 상태`}>
              <ActivityToggles />
              {healthStore.selectedToggle === "activity" && (
                <ActivityChartContainer />
              )}
              {healthStore.selectedToggle === "mental" && (
                <MentalChartContainer />
              )}
            </PageContainer>
            <Keywords />
          </div>
          <div id="activity-elem-right">
            <PageContainer title="주간 건강 리포트">
              <WeeklyStats />
            </PageContainer>
            <PageContainer title="대화 리포트">
              <MentalReport />
            </PageContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
