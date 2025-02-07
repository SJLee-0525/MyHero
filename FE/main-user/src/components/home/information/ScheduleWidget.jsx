import { useContext, useEffect, useState } from "react";
import { CalendarStoreContext } from "../../../store/calendarStore";

export default function ScheduleWidget() {
  const { selectedDate, schedules } = useContext(CalendarStoreContext);
  const [today, setToday] = useState("");

  useEffect(() => {
    // 오늘 날짜 설정 (YYYY-MM-DD 형식)
    const currentDate = new Date().toISOString().split("T")[0];
    setToday(currentDate);
  }, []);

  return (
      <div className="widget-schedule">
        <a className="widget-schedule-date">{today}</a>
        <ul>
          {schedules.schedules[today]?.length > 0 ? (
            schedules.schedules[today].map((schedule, index) => (
              <li key={index}>- {schedule}</li>
            ))
          ) : (
            <li>오늘은 아무 일정이 없습니다.</li>
          )}
        </ul>
      </div>
  );
}