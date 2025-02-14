import "./Activity.css";

import { useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";
import { HealthContext } from "../../../store/healthStore.jsx";

import PageContainer from "../container/PageContainer";

import ActivityToggles from "./ActivityToggles.jsx";
import ActivityChartContainer from "./ActiviyChartContainer";
import MentalChartContainer from "../mental/MentalChartContainer.jsx";
import WeeklyStats from "./WeeklyStats.jsx";
import MentalReport from "../mental/MentalReport.jsx";
import MentalHealth from "../mental/MentalHealth.jsx";

export default function Activity() {
  const userProgressStore = useContext(UserProgressContext);
  const healthStore = useContext(HealthContext);

  const mainUserName = "박순자123";

  if (
    userProgressStore.loginUserInfo.login &&
    userProgressStore.loginUserInfo.userInfo.role === "main"
  ) {
    return;
  }

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
            <PageContainer title="주간 건강 리포트">
              <WeeklyStats />
            </PageContainer>
          </div>
          <div id="activity-elem-right">
            {/* <Keywords /> */}
            <PageContainer title="대화 리포트">
              <MentalReport />
            </PageContainer>
            <PageContainer title="정신 건강">
              <MentalHealth />
            </PageContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
