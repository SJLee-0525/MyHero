import { useContext } from "react";
import { CalendarStoreContext } from "../../../store/calendarStore";

export default function CalendarBody() {
  const { daysInMonth, selectedDate, currentDate } =
    useContext(CalendarStoreContext);

  const weeks = ["일", "월", "화", "수", "목", "금,", "토"];

  return (
    <div style={styles.container}>
      {/* Weekdays */}
      <div style={styles.dayWrapper}>
        {weeks.map((week, index) => (
          <div
            key={week}
            style={{
              ...styles.calendarItem,
              color: index === 0 ? styles.sundayColor : styles.weekdayColor,
            }}
          >
            {week}
          </div>
        ))}
      </div>

      {/* Days */}
      <div style={styles.dayWrapper}>
        {daysInMonth.map((date) => (
          <div
            key={date.date}
            onClick={() => selectedDate.selectDate(date.date)}
            style={{
              ...styles.day,
              color:
                selectedDate.date === date.date
                  ? styles.selectedDateColor
                  : currentDate.month === date.month
                  ? date.dayIndexOfWeek === 0
                    ? styles.sundayColor
                    : styles.currentMonthColor
                  : styles.notCurrentMonthColor,
              backgroundColor:
                selectedDate.date === date.date
                  ? styles.selectedDateBgColor
                  : "transparent",
            }}
          >
            <span>{date.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    backgroundColor: "white",
    padding: "25px 0",
    borderRadius: "20px",
  },
  dayWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(50px, 1fr))",
    gridRowGap: "15px",
  },
  calendarItem: {
    display: "flex",
    justifyContent: "center",
  },
  day: {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  sundayColor: "red", // Example for Sunday color
  weekdayColor: "#333", // Example weekday color
  selectedDateColor: "white", // Selected date text color
  selectedDateBgColor: "blue", // Selected date background color
  currentMonthColor: "#000", // Text color for days in the current month
  notCurrentMonthColor: "#aaa", // Text color for days outside the current month
};
