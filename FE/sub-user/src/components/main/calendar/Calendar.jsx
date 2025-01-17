import CalendarStoreContextProvider from "../../../store/calendarStore";

import CalendarBody from "./CalendarBody";
export default function Calendar() {
  return (
    <CalendarStoreContextProvider>
      <div>
        <h3>This is Calendar</h3>
        <CalendarBody />
      </div>
    </CalendarStoreContextProvider>
  );
}
