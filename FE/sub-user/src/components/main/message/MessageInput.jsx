import "./Message.css";

import { useRef, useState, useContext } from "react";
import { MessageContext } from "../../../store/messageStore";

export default function MessageInput() {
  const messageStore = useContext(MessageContext);

  const [image, setImage] = useState(null);
  const inputMessage = useRef("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const content = inputMessage.current.value;
      const imageUrl = image ? image : null;

      const response = await messageStore.handleSendMessage(content, imageUrl);

      if (response.success) {
        // 초기화
        setImage(null);
        inputMessage.current.value = "";
      }
    } catch (error) {
      console.error(error);
    }

    // 폼 필드 초기화
    event.target.reset(); // 폼 필드 초기화
  }

  return (
    <div id="message-form-group">
      <form onSubmit={handleSubmit}>
        {/* 사진 첨부 기능 */}
        <div id="message-file-group">
          <label htmlFor="message-file">📷</label>
          <input
            id="message-file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }} // 숨겨진 파일 선택 버튼
          />
        </div>

        {/* 미리보기 이미지 */}
        {image && (
          <div id="image-preview">
            <img src={image} alt="미리보기" width="100" />
          </div>
        )}

        <div id="message-input-group">
          <input
            id="message-input"
            type="text"
            name="message"
            ref={inputMessage}
            required
          />
          <button type="submit">전송</button>
        </div>
      </form>
    </div>
  );
}
