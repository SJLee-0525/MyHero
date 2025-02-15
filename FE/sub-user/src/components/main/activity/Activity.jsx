import "./Activity.css"

import { useContext } from "react"

import { UserProgressContext } from "../../../store/userProgressStore.jsx"
import { HealthContext } from "../../../store/healthStore.jsx"

import PageContainer from "../container/PageContainer"

import ActivityToggles from "./ActivityToggles.jsx"
import ActivityChartContainer from "./ActiviyChartContainer"
import MentalChartContainer from "../mental/MentalChartContainer.jsx"
import WeeklyStats from "./WeeklyStats.jsx"
import MentalReport from "../mental/MentalReport.jsx"
import MentalHealth from "../mental/MentalHealth.jsx"

export default function Activity() {
  const userProgressStore = useContext(UserProgressContext)
  const healthStore = useContext(HealthContext)

  const mainUserName = "박순자123"

  if (userProgressStore.loginUserInfo.login && userProgressStore.loginUserInfo.userInfo.role === "main") {
    return
  }

  return (
    <div id="activity-main">
      <h2 id="main-container-title">건강</h2>
      <div id="activity-container">
        <div id="activity-elem-left">
          <div id="activity-toggle-container">
            <h2>지난 7일 요약</h2>
            <ActivityToggles />
            {healthStore.selectedToggle === "activity" && <ActivityChartContainer />}
            {healthStore.selectedToggle === "mental" && <MentalChartContainer />}
            {/* <WeeklyStats /> */}
          </div>
        </div>

        <div id="activity-elem-right">
          {/* <Keywords /> */}

          <MentalReport />

          <MentalHealth />
        </div>
      </div>
    </div>
  )
}
