import { useContext } from "react";

import { CalendarStoreContext } from "../../../store/calendarStore";

export default function SelectedDate() {
  const { selectedDate } = useContext(CalendarStoreContext);

  return <div>{selectedDate.date}</div>;
}
