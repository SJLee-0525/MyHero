import "./Activity.css";

import { useContext } from "react";

import { HealthContext } from "../../../store/healthStore.jsx";

import ActivityToggle from "./ActivityToggle.jsx";

import heartIcon from "../../../assets/icons/heart_plus.svg";
import walkIcon from "../../../assets/icons/walk.svg";

export default function ActivityToggles() {
  const healthStore = useContext(HealthContext);

  return (
    <div id="activity-toggle-group">
      <ActivityToggle
        name="정신 건강"
        imgSrc={heartIcon}
        altSrc="heart"
        status={healthStore.healthLog[healthStore.healthLog.length - 1].mental}
      />
      <ActivityToggle
        name="활동"
        imgSrc={walkIcon}
        altSrc="activity"
        status={healthStore.healthLog[healthStore.healthLog.length - 1].health}
      />
    </div>
  );
}
