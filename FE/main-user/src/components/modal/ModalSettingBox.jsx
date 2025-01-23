import "./Modal.css";
import "../settings/Settings";
import Backgrounds from "../settings/Backgrounds";"../settings/Backgrounds";
import Settings from "../settings/Settings";
import TTS from "../settings/TTS";

export default function ModalSettingBox() {
    return (
        <div id="setting-box">
            <Settings
                type="box"
            >
                배경화면 변경
                <Backgrounds/>
            </Settings>
            <Settings
                type="box"
            >
                TTS 변경
                <TTS />
            </Settings>
        </div>
    );
}