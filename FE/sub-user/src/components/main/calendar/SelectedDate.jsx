import { useContext } from "react";
import { CalendarStoreContext } from "../../../store/calendarStore";

export default function SelectedDate() {
  const { selectedDate, schedules } = useContext(CalendarStoreContext);

  return (
    <div className="calender-schedule-widget">
      {/* 위젯 내 일정 표시 */}
      <div>
        <a className="calender-schedule-date">{selectedDate.date}</a>
      </div>
      <ul>
        {schedules.schedules[selectedDate.date] ? (
          schedules.schedules[selectedDate.date].map((schedule, index) => (
            <li key={index}>- {schedule}</li>
          ))
        ) : (
          <li>There were no activities on this date.</li>
        )}
      </ul>
    </div>
  );
}
