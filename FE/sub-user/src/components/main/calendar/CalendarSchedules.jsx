import { useContext, useRef } from "react";
import { CalendarStoreContext } from "../../../store/calendarStore";

export default function CalendarSchedules() {
  const { selectedDate, schedules } = useContext(CalendarStoreContext);

  const inputScheduleRef = useRef(""); // ref 초기화

  function handleSubmitSchedule(event) {
    event.preventDefault();

    const newSchedule = inputScheduleRef.current.value; // 입력값 가져오기
    if (newSchedule.trim()) {
      schedules.addSchedule(selectedDate.date, newSchedule); // 새 일정 추가
      inputScheduleRef.current.value = ""; // 입력값 초기화
    }
  }

  return (
    <>
      <div className="calender-schedule">
        <ul>
          {schedules.schedules[selectedDate.date] ? (
            schedules.schedules[selectedDate.date].map((schedule, index) => (
              <li key={index}>- {schedule}</li>
            ))
          ) : (
            <li>There were no activities on this date.</li>
          )}
        </ul>
        <div>
          <a className="calender-schedule-date">{selectedDate.date}</a>
        </div>
      </div>
      <form onSubmit={handleSubmitSchedule} className="calendar-form">
        <input
          type="text"
          ref={inputScheduleRef}
          placeholder="Add a schedule"
        />
        <button type="submit">+</button>
      </form>
    </>
  );
}
