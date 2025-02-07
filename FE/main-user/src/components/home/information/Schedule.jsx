import React from "react";
import ScheduleWidget from "./ScheduleWidget";
import "../Home.css";

export default function Schedule() {
    return (
        <div id="schedule" style={{ height: "100%" }}>
            <div id="schedule-title">일정</div>
            <div id="schedule-info">
                    <ScheduleWidget />
            </div>
        </div>
    )
}