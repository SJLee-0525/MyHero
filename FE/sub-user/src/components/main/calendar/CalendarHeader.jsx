import "./Calendar.css";

import { useContext } from "react";
import { CalendarStoreContext } from "../../../store/calendarStore";

import arrowBackIcon from "../../../assets/icons/arrow_back.svg";
import arrowForwardIcon from "../../../assets/icons/arrow_forward.svg";

export default function CalendarHeader() {
  const { dispatch, currentDate } = useContext(CalendarStoreContext);

  return (
    <div className="calendar-header-container">
      <div className="calendar-header-change-button">
        <button onClick={dispatch.handlePrevYear}>
          <img src={arrowBackIcon} alt="prev-year" />
        </button>
        <span>{currentDate.year}</span>
        <button onClick={dispatch.handleNextYear}>
          <img src={arrowForwardIcon} alt="next-year" />
        </button>
      </div>
      <div className="calendar-header-change-button">
        <button onClick={dispatch.handlePrevMonth}>
          <img src={arrowBackIcon} alt="prev-month" />
        </button>
        <span>{currentDate.month}</span>
        <button onClick={dispatch.handleNextMonth}>
          <img src={arrowForwardIcon} alt="next-month" />
        </button>
      </div>
    </div>
  );
}
