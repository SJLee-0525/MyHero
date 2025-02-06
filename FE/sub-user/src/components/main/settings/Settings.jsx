import "./Settings.css";

import PageContainer from "../container/PageContainer.jsx";

import ToggleGroup from "../../toggle/ToggleGroup.jsx";

export default function Settings() {
  return (
    <div id="settings-main">
      <div id="main-container">
        <h2 id="main-container-title">SETTINGS</h2>
        <div id="settings-container">
          <div id="settings-elem-left">
            <PageContainer title="영웅이 제어">
              <ToggleGroup />
            </PageContainer>
          </div>
          <div id="settings-elem-right">
            <PageContainer title="주간 건강 리포트"></PageContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
