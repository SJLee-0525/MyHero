import { useContext } from "react";
import { CalendarStoreContext } from "../../../store/calendarStore";

import activityIcon from "../../../assets/icons/run.svg";
import mindfulnessIcon from "../../../assets/icons/mindfulness.svg";
import thermostatImage from "../../../assets/icons/thermostat.svg";
import airImage from "../../../assets/icons/airwave.svg";
import heatImage from "../../../assets/icons/heat.svg";
import humidityImage from "../../../assets/icons/humidity.svg";

export default function SelectedDate() {
  const { selectedDate, schedules } = useContext(CalendarStoreContext);

  const healthData = schedules.schedules.health;
  const mentalData = schedules.schedules.mental;
  const homeStatusData = schedules.schedules.homeStatus;

  return (
    <div className="calendar-schedule-widget">
      {/* 위젯 내 일정 표시 */}
      <div className="calendar-schedule-date">
        <a>{selectedDate.date}</a>
      </div>

      {/* 날짜 별 건강, 정신 평균 점수 표시 */}
      <li className="calendar-day-widget-schedules">
        <ul className="health-aver">
          <img
            className="calendar-widget-icon"
            src={activityIcon}
            alt="activity"
          />
          {healthData[selectedDate.date]
            ? healthData[selectedDate.date].averageScore.toFixed(1)
            : "-"}
        </ul>
        <ul className="mental-aver">
          <img
            className="calendar-widget-icon"
            src={mindfulnessIcon}
            alt="mental"
          />
          {mentalData[selectedDate.date]
            ? mentalData[selectedDate.date].averageScore.toFixed(1)
            : "-"}
        </ul>
      </li>

      {/* 날짜 별 집안 상태 평균 점수 표시 */}
      <li className="calendar-day-widget-schedules">
        <ul className="status-aver">
          <img
            className="calendar-widget-status-icon"
            src={thermostatImage}
            alt="temperature"
          />
          {homeStatusData[selectedDate.date]
            ? `${homeStatusData[selectedDate.date].temperature.toFixed(1)}℃`
            : "-"}
        </ul>
        <ul className="status-aver">
          <img
            className="calendar-widget-status-icon"
            src={humidityImage}
            alt="humidity"
          />
          {homeStatusData[selectedDate.date]
            ? `${homeStatusData[selectedDate.date].humidity.toFixed(1)}%`
            : "-"}
        </ul>
        <ul className="status-aver">
          <img
            className="calendar-widget-status-icon"
            src={airImage}
            alt="dust-level"
          />
          {homeStatusData[selectedDate.date]
            ? `${homeStatusData[selectedDate.date].dust_level.toFixed(1)}㎍/㎥`
            : "-"}
        </ul>
        <ul className="status-aver">
          <img
            className="calendar-widget-status-icon"
            src={heatImage}
            alt="ethanol"
          />
          {homeStatusData[selectedDate.date]
            ? `${homeStatusData[selectedDate.date].ethanol.toFixed(1)}%`
            : "-"}
        </ul>
      </li>
    </div>
  );
}
