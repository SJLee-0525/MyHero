import "./Message.css";

import { useContext } from "react";
import { MessageContext } from "../../../store/messageStore";

export default function MessageInput() {
  const messageStore = useContext(MessageContext);

  function handleSubmit(event) {
    event.preventDefault();

    // 현재 날짜와 시간을 가져오기
    const currentDate = new Date();

    // 날짜와 시간을 문자열로 포맷팅
    const formattedDate = `${currentDate.getFullYear()}년 ${
      currentDate.getMonth() + 1
    }월 ${currentDate.getDate()}일 ${currentDate.getHours()}:${currentDate.getMinutes()}`;

    // FormData에서 값을 가져오기
    const fd = new FormData(event.target);

    const role = fd.get("role");
    const message = fd.get("message");

    // role과 message가 제대로 가져와졌는지 확인
    console.log("Role:", role);
    console.log("Message:", message);

    // 데이터 객체 생성
    const data = {
      role: role,
      message: message,
      date: formattedDate,
    };

    // 메시지 전송
    messageStore.handleSendMessage(data);

    // 폼 필드 초기화
    event.target.reset(); // 폼 필드 초기화
  }

  return (
    <div id="message-form-group">
      <form onSubmit={handleSubmit}>
        <select name="role" id="message-role" required>
          <option value="main">MAIN</option>
          <option value="sub">SUB</option>
        </select>

        <div id="message-input-group">
          <input id="message-input" type="text" name="message" required />
          <button type="submit">전송</button>
        </div>
      </form>
    </div>
  );
}
