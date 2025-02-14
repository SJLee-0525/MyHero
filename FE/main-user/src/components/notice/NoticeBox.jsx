import React from "react";
import "./Notice.css";

export default function NoticeBox({ notice, onClick, isRead }) {
    const truncatedText = notice.text.length > 26 
        ? notice.text.slice(0, 26) + "..."
        : notice.text;

    const noticeClass = `notice-box ${notice.notification_grade} ${isRead ? "read" : ""}`;

    return (
        <div className={noticeClass} onClick={() => onClick(notice)}>
            <p className="notice-text">{truncatedText}</p>
            <span className="notice-time">{notice.time}</span>
        </div>
    );
}