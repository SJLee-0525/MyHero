import { useState, createContext } from "react";
import useCalander from "../hooks/useCalendar";

export const CalendarStoreContext = createContext({
  currentDate: {
    year: "",
    month: "",
    day: "",
  },
  daysInMonth: {
    date: "",
    year: "",
    month: "",
    day: "",
    dayIndexOfWeek: 1,
  },
  dispatch: {
    handlePrevYear: () => {},
    handleNextYear: () => {},
    handlePrevMonth: () => {},
    handleNextMonth: () => {},
  },
  selectedDate: {
    date: "",
    selectedDate: () => {},
  },
});

export default function CalendarStoreContextProvider({ children }) {
  const context = useCalander();

  const ctxValue = { ...context };

  return (
    <CalendarStoreContext.Provider value={ctxValue}>
      {children}
    </CalendarStoreContext.Provider>
  );
}
