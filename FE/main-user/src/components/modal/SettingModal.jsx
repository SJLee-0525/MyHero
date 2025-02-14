import "./Modal.css";
import "../settings/Settings";
import Backgrounds from "../settings/Backgrounds";"../settings/Backgrounds";
import Settings from "../settings/Settings";

export default function SettingModal({ title, onCloseConfirm, children }) {
  return (
    <div id="modal-body">
      <div id="modal-bar">
        <h2>{title}</h2>
      </div>
      <div id="setting-box">
        <Settings
            type="box"
        >
            배경화면 변경
            <Backgrounds/>
        </Settings>
      </div>
      <button onClick={onCloseConfirm} className="button">
         닫기
      </button>
    </div>
  );
}
