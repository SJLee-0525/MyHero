import { useState, createContext, useEffect } from "react";
import useCalendar from "../hooks/useCalendar";

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
  schedules: {
    schedules: [],
    addSchedule: () => {},
  },
});

export default function CalendarStoreContextProvider({ children }) {
  const context = useCalendar();

  // 상태 관리
  const [schedules, setSchedules] = useState(() => {
    // localStorage에서 초기 데이터 로드
    const storedSchedules = localStorage.getItem("schedules");
    return storedSchedules ? JSON.parse(storedSchedules) : {};
  });

  // 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  // 스케줄 추가 함수
  const addSchedule = (date, schedule) => {
    setSchedules((prevSchedules) => {
      const updatedSchedules = {
        ...prevSchedules,
        [date]: prevSchedules[date]
          ? [...prevSchedules[date], schedule]
          : [schedule],
      };
      return updatedSchedules;
    });
  };

  const ctxValue = {
    ...context,
    schedules: {
      schedules,
      addSchedule,
    },
  };

  // console.log(ctxValue)
  return (
    <CalendarStoreContext.Provider value={ctxValue}>
      {children}
    </CalendarStoreContext.Provider>
  );
}
