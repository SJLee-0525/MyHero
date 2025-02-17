import React from "react";
import { useContext } from "react";
import { useSettingStore } from "../../store/settingStore";
import { useUserProgressStore } from "../../store/userProgressStore";
import "./Message.css";

export default function Message({ text, sender, time, imageUrl }) {
    const { familyInfo } = useUserProgressStore();
    const { addBackground } = useSettingStore();

    const handleAddToBackground = () => {
        if (!familyInfo.familyId || !imageUrl) return;
        addBackground(imageUrl);
    }

    return (
        <div className={`message-wrapper ${sender === "me" ? "my-message" : "other-message"}`}>
            {sender === "me" && <span className="message-time left">{time}</span>}
            <div className={`message ${sender === "me" ? "mainText" : "subText"}`}>
            {imageUrl && (
                <div className="image-container">
                    <img src={imageUrl} alt="첨부 이미지" className="message-image" />
                    <button className="add-background-button" onClick={handleAddToBackground}>
                        ➕
                    </button>
                </div>
            )}
                <p className="message-text">{text}</p>
            </div>
            {sender === "other" && <span className="message-time right">{time}</span>}
        </div>
    );
}