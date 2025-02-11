import React from "react";
import { useEffect, useRef, useState } from "react";
import Message from "./Message.jsx";
// import Photo from "./Photo.jsx";
import ReplyBar from "./ReplyBar.jsx";
import "./Message.css";


export default function Chatting() {
    const [messages, setMessages] = useState([
        { id: 1, text: "오늘 저녁 김치찌개 먹을래?", sender: "me", time: "오후 4:05" },
        { id: 2, text: "참치야 돼지야?", sender: "other", time: "오후 4:07" }
    ]);

    const [isListening, setIsListening] = useState(false); // 음성 인식 상태
    const messageEndRef = useRef(null);

    const handleSendMessage = (newMessage) => {
        setMessages([...messages, newMessage]);
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
                <h2 className="chat-title">아들</h2>
            </div>
            <div className="message-content">
                <div className="message-list">
                    {messages.map((msg) => (
                        <Message key={msg.id} text={msg.text} sender={msg.sender} time={msg.time} />
                    ))}
                    <div ref={messageEndRef} />
                </div>
                {/* <div className="divider"></div>
                <Photo /> */}
                <ReplyBar onSend={handleSendMessage} onRetry={handleStartListening} />
            </div>
        </div>
    );
}