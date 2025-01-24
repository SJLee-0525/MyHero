import "./Calendar.css";

// import CalendarStoreContextProvider from "../../../store/calendarStore.jsx";

import PageContainer from "../container/PageContainer";

import CalendarHeader from "./CalendarHeader.jsx";
import CalendarBody from "./CalendarBody.jsx";
import SelectedDate from "./SelectedDate.jsx";
import CalendarSchedules from "./CalendarSchedules.jsx";

export default function Calendar() {
  return (
    <div id="calendar">
      {/* <h2 id="main-container-title">CALENDAR</h2> */}
      <PageContainer title="캘린더">
        {/* <CalendarStoreContextProvider> */}
        <div id="calendar">
          <CalendarHeader />
          <CalendarBody />
          <CalendarSchedules />
        </div>
        {/* </CalendarStoreContextProvider> */}
      </PageContainer>
    </div>
  );
}
