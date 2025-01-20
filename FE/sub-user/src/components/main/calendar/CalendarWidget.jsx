import "./Calendar.css";

// import CalendarStoreContextProvider from "../../../store/calendarStore";

import CalendarHeader from "./CalendarHeader";
import CalendarWidgetBody from "./CalendarWidgetBody";
import SelectedDate from "./SelectedDate";

export default function CalendarWidget() {
  return (
    // <CalendarStoreContextProvider>
    <div id="calendar">
      <CalendarHeader />
      <CalendarWidgetBody />
      <SelectedDate />
    </div>
    // </CalendarStoreContextProvider>
  );
}
