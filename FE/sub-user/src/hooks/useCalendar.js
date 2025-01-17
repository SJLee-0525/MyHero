import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from "date-fns";

import { useState } from "react";

export default function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentYear, currentMonth, currentDay] = format(
    currentDate,
    "yyyy-MM-dd"
  ).split("-");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const startCurrentMonth = startOfMonth(currentDate);
  const endCurrentMonth = endOfMonth(currentDate);
  const startOfFirstWeek = startOfWeek(startCurrentMonth, { weekStartsOn: 0 });
  const endOfLastWeek = endOfWeek(endCurrentMonth, { weekStartsOn: 0 });

  const days = eachDayOfInterval({
    start: startOfFirstWeek,
    end: endOfLastWeek,
  });

  function handlePrevYear() {
    setCurrentDate((prevDate) => {
      return subYears(prevDate, 1);
    });
  }

  function handleNextYear() {
    setCurrentDate((prevDate) => {
      return addYears(prevDate, 1);
    });
  }

  function handlePrevMonth() {
    setCurrentDate((prevDate) => {
      return subMonths(prevDate, 1); // 'return' 추가
    });
  }

  function handleNextMonth() {
    setCurrentDate((prevDate) => {
      return addMonths(prevDate, 1); // 'return' 추가
    });
  }

  function handleSelectDate(date) {
    setSelectedDate(date);
  }

  const daysInMonth = days.map((day) => ({
    date: format(day, "yyyy-MM-dd"),
    year: format(day, "yyyy"),
    month: format(day, "MM"),
    day: format(day, "dd"),
    dayIndexOfWeek: getDay(day),
  }));

  return {
    currentDate: {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
    },
    daysInMonth,
    dispatch: {
      handlePrevYear,
      handleNextYear,
      handlePrevMonth,
      handleNextMonth,
    },
    selectedDate: {
      date: selectedDate,
      selectDate: handleSelectDate,
    },
  };
}
