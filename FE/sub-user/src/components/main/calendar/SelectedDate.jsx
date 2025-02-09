import { useContext } from "react"
import { CalendarStoreContext } from "../../../store/calendarStore"

import activityIcon from "../../../assets/icons/run.svg"
import mindfulnessIcon from "../../../assets/icons/mindfulness.svg"

export default function SelectedDate() {
  const { selectedDate, schedules } = useContext(CalendarStoreContext)

  const healthData = schedules.schedules.health
  const mentalData = schedules.schedules.mental

  return (
    <div className="calender-schedule-widget">
      {/* 위젯 내 일정 표시 */}
      <div>
        <a className="calender-schedule-date">{selectedDate.date}</a>
      </div>

      {/* 캘린더에 일정을 간략하게 표시 */}
      <li className="calendar-day-widget-schedules">
        <ul className="health-aver">
          <img className="calendar-widget-icon" src={activityIcon} alt="activity" />
          {healthData[selectedDate.date] ? healthData[selectedDate.date].averageScore : "NO DATA"}
        </ul>
        <ul className="mental-aver">
          <img className="calendar-widget-icon" src={mindfulnessIcon} alt="mental" />
          {mentalData[selectedDate.date] ? mentalData[selectedDate.date].averageScore : "NO DATA"}
        </ul>
      </li>
    </div>
  )
}
