import "./Message.css";

import { useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import SelectMessageRoom from "./SelectMessageRoom.jsx";
import MessageChat from "./MessageChat.jsx";
import MessageInput from "./MessageInput";

export default function Message() {
  const userProgressStore = useContext(UserProgressContext);

  if (
    userProgressStore.loginUserInfo.login &&
    userProgressStore.loginUserInfo.userInfo.role === "main"
  ) {
    return;
  }

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
