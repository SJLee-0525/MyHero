import "./Main.css";

import { useContext } from "react";

import Widget from "../widget/Widget.jsx";
import Toggle from "../toggle/Toggle.jsx";

import heartImage from "../../assets/side-heart.png";
import settingImage from "../../assets/side-setting.png";

import { MainStoreContext } from "../../store/mainStore.jsx";

export default function Main() {
  const mainStore = useContext(MainStoreContext);

  const contents = ["임영웅", "김치찌개", "두부", "여행", "병원"];
  const colors = [
    ["#146152", "white"],
    ["#44803F", "white"],
    ["#B4CF66", "black"],
    ["#FFEC5C", "black"],
    ["#FF5A33", "white"],
  ];

  return (
    <div id="page-container">
      <div id="page-header">
        <h1>HOME</h1>
      </div>
      <Widget title="박순자님의 집">
        <div id="toggle-group">
          <Toggle
            name="toggle1"
            status={mainStore.toggleStatus.toggle1}
            onClickToggle={mainStore.handleToggleStatus}
            imgSrc={heartImage}
            altSrc="heart"
          ></Toggle>
          <Toggle
            name="toggle2"
            status={mainStore.toggleStatus.toggle2}
            onClickToggle={mainStore.handleToggleStatus}
            imgSrc={settingImage}
            altSrc="heart"
          ></Toggle>
          <Toggle
            name="toggle3"
            status={mainStore.toggleStatus.toggle3}
            onClickToggle={mainStore.handleToggleStatus}
            imgSrc={settingImage}
            altSrc="heart"
          ></Toggle>
          <Toggle
            name="toggle4"
            status={mainStore.toggleStatus.toggle4}
            onClickToggle={mainStore.handleToggleStatus}
            imgSrc={heartImage}
            altSrc="heart"
          ></Toggle>
        </div>
      </Widget>
      <Widget title="오늘 박순자님의 대화 키워드" type="keyword">
        {contents.map((content, index) => {
          return (
            <span
              key={index}
              id="content-box"
              style={{
                backgroundColor: colors[index % colors.length][0],
                color: colors[index % colors.length][1],
              }}
            >
              {content}
            </span>
          );
        })}
      </Widget>
    </div>
  );
}
