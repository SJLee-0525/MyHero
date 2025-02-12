import React from "react";
import { useState, useEffect, useRef } from "react";
import Message from "./Message.jsx";
import ReplyBar from "./ReplyBar.jsx";
import { useMessageStore } from "../../store/messageStore.jsx"
import "./Message.css";

export default function Chatting() {
    const { selectedUser, conversations, addMessage } = useMessageStore();
    const [isListening, setIsListening] = useState(false); // 음성 인식 상태
    const messageEndRef = useRef(null);

    if (!selectedUser) return <p>대화할 상대를 선택하세요.</p>;

    const messages = conversations[selectedUser.user_id] || [];

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    const handleSendMessage = (newMessage) => {
        addMessage(selectedUser.user_id, newMessage);
        setIsListening(false); // 메시지 전송 후 음성 인식 종료
    };

    const handleStartListening = () => {
        setIsListening(true);
        // STT (Speech-to-Text) API 호출 로직
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    return (
        <div className="message-container">
            <div className="message-header">
                <h2 className="chat-title">{selectedUser.name}</h2>
            </div>
            <div className="message-content">
                <div className="message-list">
                    {messages.map((msg) => (
                        <Message key={msg.index} text={msg.content} sender={msg.from_id === selectedUser.user_id ? "other" : "me"} time={msg.created_at} />
                    ))}
                    <div ref={messageEndRef} />
                </div>
                <ReplyBar onSend={handleSendMessage} onRetry={handleStartListening} />
            </div>
        </div>
    );
}