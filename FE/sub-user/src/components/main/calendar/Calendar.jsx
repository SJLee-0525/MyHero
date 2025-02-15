import "./Calendar.css"

// import CalendarStoreContextProvider from "../../../store/calendarStore.jsx";

import PageContainer from "../container/PageContainer"

import CalendarHeader from "./CalendarHeader.jsx"
import CalendarBody from "./CalendarBody.jsx"
// import SelectedDate from "./SelectedDate.jsx";
import CalendarSchedules from "./CalendarSchedules.jsx"

export default function Calendar() {
  return (
    <div id="calendar-main">
      <h2 id="main-container-title">캘린더</h2>
      <div id="calendar">
        <div id="calendar-left">
          <CalendarHeader />
          <CalendarBody />
        </div>
        <div id="calendar-right">
          <CalendarSchedules />
        </div>
      </div>
      {/* </CalendarStoreContextProvider> */}
    </div>
  )
}
