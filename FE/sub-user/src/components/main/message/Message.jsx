import "./Message.css";

import PageContainer from "../container/PageContainer.jsx";

import SelectMessageRoom from "./SelectMessageRoom.jsx";
import MessageChat from "./MessageChat.jsx";
import MessageInput from "./MessageInput";

export default function Message() {
  return (
    <div id="message-main">
      <div id="message-left">
        <SelectMessageRoom />
      </div>
      <div id="message-right">
        <div id="message">
          <MessageChat />
          <MessageInput />
        </div>
      </div>
    </div>
  );
}
