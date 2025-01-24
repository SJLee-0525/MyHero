import React from "react";
import "./Alert.css";

export default function Alert({type, children}) {
    return (
        <div id={type}>
            <p id="content">매우 비상</p>
            {type === "alert" && <p className="emergency-alert-content">{children}</p>}
        </div>
    );
  };