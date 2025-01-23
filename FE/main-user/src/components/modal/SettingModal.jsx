import "./Modal.css";

export default function SettingModal({ title, onCloseConfirm, children }) {
  return (
    <div id="modal-body">
      <div id="modal-bar">
        <h2>{title}</h2>
      </div>
      {children}
      <button onClick={onCloseConfirm} className="button">
         닫기
      </button>
    </div>
  );
}
