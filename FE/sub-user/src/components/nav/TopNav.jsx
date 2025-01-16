import "./Nav.css";
import { useState, useContext } from "react";
import { MainStoreContext } from "../../store/mainStore";
import TopNavSideNavElems from "./TopNavSideElems";
import heartIcon from "../../assets/side-heart.png";
import settingIcon from "../../assets/side-setting.png";

export default function TopNav() {
  const mainStore = useContext(MainStoreContext);
  const [sidebarIsOpened, setSidebarIsOpened] = useState(false);

  function handleSidebarToggle() {
    setSidebarIsOpened((prev) => !prev);
  }

  return (
    <>
      <nav id="top-bar">
        <div id="top-bar-toggle-menu">
          <button onClick={handleSidebarToggle}>
            <img src={settingIcon} alt="nav-toggle" />
          </button>
        </div>
        <h3>Top Nav</h3>
        <div id="top-bar-toggle-menu">
          <button>
            <img src={heartIcon} alt="userinfo-toggle" />
          </button>
        </div>
      </nav>

      <aside className={`sidebar ${sidebarIsOpened ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h3>Side Menu</h3>
          <button onClick={handleSidebarToggle}>X</button>
        </div>
        <ul className="sidebar-nav">
          <TopNavSideNavElems
            imgSrc={heartIcon}
            altSrc="heart"
            identifier="Icon 1"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={heartIcon}
            altSrc="heart"
            identifier="Icon 2"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={heartIcon}
            altSrc="heart"
            identifier="Icon 3"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
        </ul>
        <ul className="sidebar-nav">
          <TopNavSideNavElems
            imgSrc={settingIcon}
            altSrc="setting"
            identifier="Setting 1"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <TopNavSideNavElems
            imgSrc={settingIcon}
            altSrc="setting"
            identifier="Setting 2"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
        </ul>
      </aside>
    </>
  );
}
