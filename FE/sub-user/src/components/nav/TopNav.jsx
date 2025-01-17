import "./Nav.css";
import { useState, useContext } from "react";

import { MainStoreContext } from "../../store/mainStore";

import TopNavSideNavElems from "./TopNavSideElems";

import menuIcon from "../../assets/icons/menu.svg";
import personIcon from "../../assets/icons/person.svg";

import closeIcon from "../../assets/icons/close.svg";

import homeIcon from "../../assets/icons/home.svg";
import calanderIcon from "../../assets/icons/calander.svg";
import smsIcon from "../../assets/icons/sms.svg";
import notificationIcon from "../../assets/icons/notification.svg";
import vitalSignIcon from "../../assets/icons/vital_sign.svg";
import mindfulnessIcon from "../../assets/icons/mindfulness.svg";
import sirenIcon from "../../assets/icons/siren.svg";
import runIcon from "../../assets/icons/run.svg";

import settingIcon from "../../assets/icons/settings.svg";

export default function TopNav() {
  const mainStore = useContext(MainStoreContext);

  return (
    <div id="mobile-bar">
      <nav className="top-bar">
        <div className="top-bar-toggle-menu">
          <button onClick={mainStore.handleSidebarToggle}>
            <img src={menuIcon} alt="menu" />
          </button>
        </div>
        <h3>
          {!mainStore.isActiveSideBarElem
            ? "SUNGJOONKING"
            : mainStore.isActiveSideBarElem.toUpperCase()}
        </h3>
        <div className="top-bar-toggle-menu">
          <button>
            <img src={personIcon} alt="userinfo" />
          </button>
        </div>
      </nav>

      <aside
        className={`top-side-bar ${
          mainStore.sidebarIsOpened ? "open" : "closed"
        }`}
      >
        <div className="top-side-bar-header">
          <h3>Log in to continue ...</h3>
          <button onClick={mainStore.handleSidebarToggle}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <ul className="top-side-bar-nav">
          <TopNavSideNavElems
            imgSrc={homeIcon}
            altSrc="home"
            identifier="HOME"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={notificationIcon}
            altSrc="notification"
            identifier="NOTIFICATION"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={smsIcon}
            altSrc="message"
            identifier="MESSAGE"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={sirenIcon}
            altSrc="emergency"
            identifier="EMERGENCY"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={calanderIcon}
            altSrc="calander"
            identifier="CALANDER"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={runIcon}
            altSrc="activity"
            identifier="ACTIVITY"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={vitalSignIcon}
            altSrc="health"
            identifier="HEALTH"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={mindfulnessIcon}
            altSrc="mind"
            identifier="MIND"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={settingIcon}
            altSrc="settings"
            identifier="SETTINGS"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
        </ul>
      </aside>
    </div>
  );
}
