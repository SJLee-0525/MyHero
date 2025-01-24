import Alert from "../alert/Alert";
import "./Modal.css";

export default function EmergencyModal({ title, onCloseConfirm}) {
  return (
    <div id="emergency-modal-body">
      <div id="emergency-modal-bar">
        <h2>{title}</h2>
      </div>
      <Alert />
      <div id="double-button">
        <button onClick={onCloseConfirm} className="redButton">
            신고하기
        </button>
        <button onClick={onCloseConfirm} className="button">
            닫기
        </button>
      </div>
    </div>
  );
}