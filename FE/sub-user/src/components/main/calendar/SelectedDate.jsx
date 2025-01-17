import { useContext, useRef } from "react";
import { CalendarStoreContext } from "../../../store/calendarStore";

export default function SelectedDate() {
  const { selectedDate, schedules } = useContext(CalendarStoreContext);

  return (
    <div className="calender-schedule-widget">
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
