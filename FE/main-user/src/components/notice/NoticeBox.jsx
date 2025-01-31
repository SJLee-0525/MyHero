import React from "react";
import "./Notice.css";

export default function NoticeBox({ notice, onClick, isRead }) {
    return (
        <div className={`notice-box ${notice.type} ${isRead ? "read" : ""}`} onClick={() => onClick(notice)}>
            <p className="notice-text">{notice.text}</p>
            <span className="notice-time">{notice.time}</span>
        </div>
    );
}