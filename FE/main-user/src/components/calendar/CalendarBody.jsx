import "./Calendar.css"

import { useContext } from "react"
import { CalendarStoreContext } from "../../store/calendarStore.jsx"

export default function CalendarBody() {
  const { daysInMonth, selectedDate, currentDate, schedules } = useContext(CalendarStoreContext)

  if (!Array.isArray(daysInMonth)) {
    return <p>날짜 데이터를 불러오는 중...</p>;
  }
  
  console.log(daysInMonth);

  const weeks = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="calendar-container">
      {/* 요일 표시 */}
      <div className="calendar-day-wrapper">
        {weeks.map((week, index) => (
          <div 
            key={week} 
            className={`calendar-item ${index === 0 ? "sunday" : "weekday"}`}>
            {week}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="calendar-day-wrapper">
        {daysInMonth.map((date) =>
          <div
            key={date.date}
            onClick={() => selectedDate.selectDate(date.date)}
            className={`calendar-day 
              ${selectedDate.date === date.date ? "selected-date" : ""}
              ${currentDate.month !== date.month ? "not-current-month" : ""}
              ${date.dayIndexOfWeek === 0 ? "sunday" : ""}
            `}
          >
            <div>
              <span>{date.day}</span>
            </div>
            {/* 캘린더에 일정을 간략하게 표시 */}
            {schedules.schedules[date.date] && (
              <li className="calendar-day-schedules">
                {schedules.schedules[date.date].slice(0, 2).map((schedule, index) => (
                  <ul key={index} className="calendar-day-schedule">
                    {schedule}
                  </ul>
                ))}
              </li>
            )}
          </div>
        )}
      </div>
    </div>
  )
}