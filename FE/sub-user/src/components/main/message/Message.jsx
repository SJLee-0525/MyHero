import "./Message.css";

import PageContainer from "../container/PageContainer.jsx";
import MessageChat from "./MessageChat.jsx";
import MessageInput from "./MessageInput";

// import MessageContextProvider from "../../../store/messageStore.jsx";

export default function Message() {
  return (
    <PageContainer title="메시지">
      {/* <MessageContextProvider> */}
      <div id="message">
        <h2>어머니😎</h2>
        {/* 메시지 출력 */}
        <MessageChat />

        {/* 메시지 입력 */}
        <MessageInput />
      </div>
      {/* </MessageContextProvider> */}
    </PageContainer>
  );
}
