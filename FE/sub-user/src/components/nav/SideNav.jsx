import "./Nav.css";

import { useContext } from "react";

import SideNavElems from "./SideNavElems.jsx";

import { MainStoreContext } from "../../store/mainStore.jsx";

import heartIcon from "../../assets/side-heart.png";
import settingIcon from "../../assets/side-setting.png";

export default function SideNav() {
  const mainStore = useContext(MainStoreContext);

  return (
    <aside id="side-bar">
      <div>
        <h3>Side</h3>
        <ul className="side-nav-elems">
          <SideNavElems
            imgSrc={heartIcon}
            altSrc="heart"
            identifier="Icon 1"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <SideNavElems
            imgSrc={heartIcon}
            altSrc="heart"
            identifier="Icon 2"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <SideNavElems
            imgSrc={heartIcon}
            altSrc="heart"
            identifier="Icon 3"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
        </ul>
      </div>
      <div>
        <ul className="side-nav-elems">
          <SideNavElems
            imgSrc={settingIcon}
            altSrc="setting"
            identifier="Setting 1"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
          <SideNavElems
            imgSrc={settingIcon}
            altSrc="setting"
            identifier="Setting 2"
            activeIdentifier={mainStore.isActiveSideBarElem}
            onClickElem={mainStore.handleActiveSideBarElem}
          />
        </ul>
      </div>
    </aside>
  );
}
