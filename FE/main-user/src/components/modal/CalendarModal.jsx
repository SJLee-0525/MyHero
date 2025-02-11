import React from "react"
import Calendar from "../calendar/Calendar"
import "./Modal.css"

import CalendarStoreContextProvider from "../../store/calendarStore"

export default function CalendarModal({ title, onCloseConfirm }) {
  return (
    <div id="modal-body-thin">
      <div id="modal-bar-thin">
        <h2>{title}</h2>
      </div>
      <CalendarStoreContextProvider>
        <Calendar />
      </CalendarStoreContextProvider>
      <button onClick={onCloseConfirm} className="button">
        닫기
      </button>
    </div>
  )
}
