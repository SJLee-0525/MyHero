import WeeklyChart from "./WeeklyChart.jsx";

import WeeklySummary from "./WeeklySummary";

export default function WeeklyStats() {
  return (
    <div id="weekly-stats-container">
      <div id="weekly-chart-container">
        <h3>건강 통계</h3>
        <WeeklyChart />
      </div>
      <div id="summary-container">
        <WeeklySummary />
      </div>
    </div>
  );
}
