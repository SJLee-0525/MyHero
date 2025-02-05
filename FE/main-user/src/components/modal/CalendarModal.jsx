import "./Modal.css";

export default function CalendarModal({ title, onCloseConfirm }) {
  return (
    <div id="modal-body">
      <div id="modal-bar">
        <h2>{title}</h2>
      </div>
      <button onClick={onCloseConfirm} className="button">
         닫기
      </button>
    </div>
  );
}