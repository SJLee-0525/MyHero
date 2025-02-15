import React from "react";
import "./Message.css";

export default function Message({ text, sender, time, imageUrl }) {
    return (
        <div className={`message-wrapper ${sender === "me" ? "my-message" : "other-message"}`}>
            {/* 내가 보낸 메시지일 경우 왼쪽에 시간, 오른쪽에 메시지 */}
            {sender === "me" && <span className="message-time left">{time}</span>}
            <div className={`message ${sender === "me" ? "mainText" : "subText"}`}>
            {imageUrl && <img src={imageUrl} alt="첨부 이미지" className="message-image" />}
                <p className="message-text">{text}</p>
            </div>
            {/* 상대방이 보낸 메시지일 경우 오른쪽에 시간 */}
            {sender === "other" && <span className="message-time right">{time}</span>}
        </div>
    );
}