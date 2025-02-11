import React from "react";
import "./News.css";

export default function NewsBox({ news, onClick, isRead }) {
    return (
        <div className={`news-box ${news.type} ${isRead ? "read" : ""}`} onClick={() => onClick(news)}>
            <p className="news-text">{news.text}</p>
            <span className="news-time">{news.time}</span>
        </div>
    );
}