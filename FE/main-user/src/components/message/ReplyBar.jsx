import React from "react";
import { useState } from "react";
import { useMessageStore } from "../../store/messageStore";
import "./Message.css";

export default function ReplyBar({ onSend }) {
    const [message, setMessage] = useState("");
    const [isListening, setIsListening] = useState(false); // 음성 인식 상태
    const { selectedUser, addMessage } = useMessageStore();

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        if (message.trim() === "") return;

        const newMessage = {
            index: Date.now(),
            from_id: "me",
            to_id: selectedUser.user_id,
            created_at: new Date().toLocaleString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
            content: message
        };

        addMessage(selectedUser.user_id, newMessage);
        setMessage("");
        setIsListening(false); // 전송 후 음성 인식 종료
    };

    // 다시 말하기 (음성 인식 재시작)
    const handleRetry = () => {
        setMessage(""); // 기존 메시지 초기화
        setIsListening(true); // 음성 인식 다시 시작
        if (typeof onRetry === "function") {
            onRetry(); // 존재할 때만 실행
        }
    };

    return (
        <div className="reply-bar">
            <input
                type="text"
                placeholder={isListening ? "음성을 인식하고 있습니다..." : "입력된 텍스트"}
                value={message}
                onChange={handleChange}
                disabled={isListening}    
            />
            
            {/* 음성 인식 완료 시 "다시 말하기" 버튼 추가 */}
            {message && (
                <button className="retry-button" onClick={handleRetry}>다시 말하기</button>
            )}

            {/* 입력된 메시지가 없을 경우 전송 버튼 비활성화 */}
            <button className={`send-button ${message ? "active" : "disabled"}`} onClick={handleSend} disabled={!message}>
                전송
            </button>
        </div>
    );
}