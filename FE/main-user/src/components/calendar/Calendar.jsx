import "./Calendar.css";

import CalendarHeader from "./CalendarHeader.jsx";
import CalendarBody from "./CalendarBody.jsx";
import CalendarSchedules from "./CalendarSchedules.jsx";

export default function Calendar() {
  return (
    <div id="calendar">
      <CalendarHeader />
      <CalendarBody />
      <CalendarSchedules />
    </div>
  );
}
