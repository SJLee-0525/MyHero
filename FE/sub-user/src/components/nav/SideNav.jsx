import "./Nav.css"

import { useContext } from "react"

import SideNavElems from "./SideNavElems.jsx"

import { UserProgressContext } from "../../store/userProgressStore.jsx"

import homeIcon from "../../assets/icons/home.svg"
import calendarIcon from "../../assets/icons/calendar.svg"
import smsIcon from "../../assets/icons/sms.svg"
import notificationIcon from "../../assets/icons/notification.svg"
import vitalSignIcon from "../../assets/icons/vital_sign.svg"
import mindfulnessIcon from "../../assets/icons/mindfulness.svg"
import sirenIcon from "../../assets/icons/siren.svg"
import runIcon from "../../assets/icons/run.svg"

import accountIcon from "../../assets/icons/account_circle.svg"
import settingIcon from "../../assets/icons/settings.svg"

export default function SideNav() {
  const userProgressStore = useContext(UserProgressContext)

  return (
    <aside id="side-bar">
      <div>
        <h5>{!userProgressStore.isActiveSideBarElem ? "SJKING" : userProgressStore.isActiveSideBarElem.toUpperCase()}</h5>
        <ul className="side-nav-elems">
          <SideNavElems imgSrc={homeIcon} altSrc="home" identifier="HOME" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
          <SideNavElems
            imgSrc={notificationIcon}
            altSrc="notification"
            identifier="NOTIFICATION"
            activeIdentifier={userProgressStore.isActiveSideBarElem}
            onClickElem={userProgressStore.handleActiveSideBarElem}
          />
          <SideNavElems imgSrc={smsIcon} altSrc="message" identifier="MESSAGE" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
          <SideNavElems imgSrc={sirenIcon} altSrc="emergency" identifier="EMERGENCY" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
          <SideNavElems
            imgSrc={calendarIcon}
            altSrc="calendar"
            identifier="CALENDAR"
            activeIdentifier={userProgressStore.isActiveSideBarElem}
            onClickElem={userProgressStore.handleActiveSideBarElem}
          />
          <SideNavElems imgSrc={runIcon} altSrc="activity" identifier="ACTIVITY" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
          <SideNavElems imgSrc={vitalSignIcon} altSrc="health" identifier="HEALTH" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
          <SideNavElems imgSrc={mindfulnessIcon} altSrc="mind" identifier="MIND" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
        </ul>
      </div>
      <div>
        <ul className="side-nav-elems">
          <SideNavElems imgSrc={accountIcon} altSrc="accounts" identifier="ACCOUNTS" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
          <SideNavElems imgSrc={settingIcon} altSrc="settings" identifier="SETTINGS" activeIdentifier={userProgressStore.isActiveSideBarElem} onClickElem={userProgressStore.handleActiveSideBarElem} />
        </ul>
      </div>
    </aside>
  )
}
