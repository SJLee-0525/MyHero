import { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import "./Nav.css"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

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
import sirenIcon from "../../assets/icons/siren.svg"
import runIcon from "../../assets/icons/run.svg"
import settingIcon from "../../assets/icons/settings.svg"

export default function TopNav() {
  const userProgressStore = useContext(UserProgressContext)
  const navigate = useNavigate()

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 720)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 720)
    }

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize)

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // 화면 너비가 600px 이하일 때만 렌더링
  if (!isMobile) return null

  return ReactDOM.createPortal(
    <div id="mobile-bar">
      <nav className="top-bar">
        <div className="top-bar-toggle-menu">
          <button onClick={userProgressStore.handleSidebarToggle}>
            <img src={menuIcon} alt="menu" />
          </button>
        </div>
        <h3>{!userProgressStore.isActiveSideBarElem ? "SUNGJOONKING" : userProgressStore.isActiveSideBarElem.toUpperCase()}</h3>
        <div className="top-bar-toggle-menu">
          <button
            onClick={() => {
              navigate("/accounts")
            }}
          >
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
            altSrc="mental"
            identifier="MENTAL"
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
    </div>,
    document.getElementById("nav")
  )
}
