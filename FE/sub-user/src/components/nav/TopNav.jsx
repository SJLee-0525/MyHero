import "./Nav.css"
import { useState, useContext } from "react"

import { UserProgressContext } from "../../store/userProgressStore"

import TopNavSideNavElems from "./TopNavSideElems"

import menuIcon from "../../assets/icons/menu.svg"
import personIcon from "../../assets/icons/person.svg"

import closeIcon from "../../assets/icons/close.svg"

import homeIcon from "../../assets/icons/home.svg"
import calendarIcon from "../../assets/icons/calendar.svg"
import smsIcon from "../../assets/icons/sms.svg"
import notificationIcon from "../../assets/icons/notification.svg"
import vitalSignIcon from "../../assets/icons/vital_sign.svg"
import mindfulnessIcon from "../../assets/icons/mindfulness.svg"
import sirenIcon from "../../assets/icons/siren.svg"
import runIcon from "../../assets/icons/run.svg"

import settingIcon from "../../assets/icons/settings.svg"

export default function TopNav() {
  const userProgressStore = useContext(UserProgressContext)

  return (
    <div id="mobile-bar">
      <nav className="top-bar">
        <div className="top-bar-toggle-menu">
          <button onClick={userProgressStore.handleSidebarToggle}>
            <img src={menuIcon} alt="menu" />
          </button>
        </div>
        <h3>{!userProgressStore.isActiveSideBarElem ? "SUNGJOONKING" : userProgressStore.isActiveSideBarElem.toUpperCase()}</h3>
        <div className="top-bar-toggle-menu">
          <button>
            <img src={personIcon} alt="userinfo" />
          </button>
        </div>
      </nav>

      <aside className={`top-side-bar ${userProgressStore.sidebarIsOpened ? "open" : "closed"}`}>
        <div className="top-side-bar-header">
          <h3>Log in to continue ...</h3>
          <button onClick={userProgressStore.handleSidebarToggle}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <ul className="top-side-bar-nav">
          <TopNavSideNavElems imgSrc={homeIcon} altSrc="home" identifier="HOME" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
          <TopNavSideNavElems
            imgSrc={notificationIcon}
            altSrc="notification"
            identifier="NOTIFICATION"
            activeIdentifier={userProgressStore.isActiveSideBarElem}
            onClickElem={userProgressStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems imgSrc={smsIcon} altSrc="message" identifier="MESSAGE" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
          <TopNavSideNavElems
            imgSrc={sirenIcon}
            altSrc="emergency"
            identifier="EMERGENCY"
            activeIdentifier={userProgressStore.isActiveSideBarElem}
            onClickElem={userProgressStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={calendarIcon}
            altSrc="calendar"
            identifier="CALENDAR"
            activeIdentifier={userProgressStore.isActiveSideBarElem}
            onClickElem={userProgressStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={runIcon}
            altSrc="activity"
            identifier="ACTIVITY"
            activeIdentifier={userProgressStore.isActiveSideBarElem}
            onClickElem={userProgressStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={vitalSignIcon}
            altSrc="health"
            identifier="HEALTH"
            activeIdentifier={userProgressStore.isActiveSideBarElem}
            onClickElem={userProgressStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={mindfulnessIcon}
            altSrc="mind"
            identifier="MIND"
            activeIdentifier={userProgressStore.isActiveSideBarElem}
            onClickElem={userProgressStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={settingIcon}
            altSrc="settings"
            identifier="SETTINGS"
            activeIdentifier={userProgressStore.isActiveSideBarElem}
            onClickElem={userProgressStore.handleActiveSideBarElem}
          />
        </ul>
      </aside>
    </div>
  )
}
