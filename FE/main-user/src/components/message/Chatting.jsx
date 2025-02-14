import React from "react";
import { useState, useEffect, useRef } from "react";
import Message from "./Message.jsx";
import ReplyBar from "./ReplyBar.jsx";
import { useMessageStore } from "../../store/messageStore.jsx";
import { useUserProgressStore } from "../../store/userProgressStore.jsx";
import "./Message.css";

export default function Chatting({ isOpen }) {
    const { selectedUser, conversations } = useMessageStore();
    const { loginUserInfo } = useUserProgressStore();
    const [isListening, setIsListening] = useState(false); // 음성 인식 상태
    const messageEndRef = useRef(null);
    
    useEffect(() => {
        if (isOpen && selectedUser.user_id) {
            console.log(`📩 ${selectedUser.user_id}와의 전체 대화 내역 불러오기 시작`);
            fetchMessages(selectedUser.user_id);
        }
        
        return () => {
            console.log("🚪 채팅 창이 닫혔습니다. 메시지 가져오기를 중단합니다.");
        };
    }, [isOpen, selectedUser]);
    
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
        }
    }, [conversations[selectedUser.user_id]]);
    
    if (!selectedUser || !conversations || !conversations[selectedUser.user_id]) return <p>불러오는 중입니다...</p>;
    
    const handleSendMessage = async (newMessage) => {
        const newMsgObject = {
            index: Date.now() + 9 * 60 * 60 * 1000,  // 임시 ID (서버와 동기화되면 변경 가능)
            from_id: loginUserInfo.userInfo.id, // 내가 보낸 메시지
            to_id: selectedUser.user_id,
            created_at: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(),
            content: newMessage,
            sender: "me"
        };

        const response = await sendMessageToServer(newMsgObject);

        if (response.success) {
            console.log("✅ 서버에 메시지 저장 완료:", response.data);
        } else {
        console.error("❌ 메시지 전송 실패:", response.error);
        }

        setIsListening(false); // 메시지 전송 후 음성 인식 종료
    };

    const handleStartListening = () => {
        setIsListening(true);
        // STT (Speech-to-Text) API 호출 로직
    };

    return (
        <div className="message-container">
            <div className="message-header">
                <h2 className="chat-title">{selectedUser.name}</h2>
            </div>
            <div className="message-content">
                <div className="message-list">
                    {(conversations[selectedUser.user_id] && conversations[selectedUser.user_id].length === 0) ? (
                        <p className="no-messages">대화 내역이 없습니다.</p>
                    ) : (
                        conversations[selectedUser.user_id].map((msg) => (
                            <Message 
                                key={msg.index} 
                                text={msg.content} 
                                sender={msg.sender} 
                                time={(() => {
                                    const date = new Date(msg.created_at);
                                    date.setHours(date.getHours() + 9); // ✅ UTC+9 변환
                            
                                    const hours = date.getHours();
                                    const minutes = date.getMinutes().toString().padStart(2, "0");
                                    const period = hours >= 12 ? "오후" : "오전"; // ✅ 오전/오후 구분
                                    const formattedHours = hours % 12 || 12; // 12시간 형식 변환 (0시는 12로)
                            
                                    return `${period} ${formattedHours}:${minutes}`;
                                })()}
                            />
                        ))
                    )}
                    <div ref={messageEndRef} />
                </div>
                <ReplyBar onSend={handleSendMessage} onRetry={handleStartListening} />
            </div>
        </div>
    );
}