import "./Modal.css";

export default function MessageModal({ title, message, onCloseConfirm }) {
  return (
    <div id="modal-body">
      <div id="modal-bar">
        <h2>{title}</h2>
        <button onClick={onCloseConfirm} className="button">
          X
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
}
