import "./Message.css";

import { useRef, useEffect, useContext } from "react";

import { MessageContext } from "../../../store/messageStore";

export default function MessageChat() {
  const messageStore = useContext(MessageContext);

  const chatRef = useRef(null); // #chat 요소를 참조하기 위한 ref

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight; // 맨 아래로 스크롤
    }
  }, [messageStore.messageLog]); // messageLog가 변경될 때마다 실행

  console.log(messageStore.messageLog);
  return (
    <div id="message-chat">
      {/* 메시지 기록 출력 */}
      {messageStore.messageLog.length === 0 && (
        <div id="no-chat">
          <span>대화 기록이 없습니다.</span>
        </div>
      )}
      {messageStore.messageLog.length > 0 && (
        <div id="chat" ref={chatRef}>
          {messageStore.messageLog.map((log) => {
            return (
              <div key={log.id}>
                {log.role === "main" && (
                  <div className="main">
                    <span className="main-chat">{log.message}</span>
                    <span className="chat-date">{log.date}</span>
                  </div>
                )}
                {log.role === "sub" && (
                  <div className="sub">
                    <span className="chat-date">{log.date}</span>
                    <span className="sub-chat">{log.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
