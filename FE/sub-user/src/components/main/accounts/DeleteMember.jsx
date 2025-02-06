import "./Accounts.css";

import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import Modal from "../../modal/Modal.jsx";

export default function DeleteMember() {
  const userProgressStore = useContext(UserProgressContext);
  const navigate = useNavigate();

  const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);

  const inputPassword = useRef("");

  // 가족 삭제 로직
  async function handleDeleteMember() {
    // 비밀번호 유효성 검사
    const inputIsInvalid = inputPassword.current.value.length < 8;
    if (inputIsInvalid) {
      setPasswordIsInvalid(true);
      return;
    }

    try {
      const result = await userProgressStore.handleDeleteMember(
        inputPassword.current.value
      );

      if (result.success === true) {
        // 가족 삭제 성공
        alert("가족 모임 삭제 성공");
        userProgressStore.handleCloseModal();
        inputPassword.current.value = "";
        navigate("/accounts");
      } else {
        console.error("가족 모임 삭제 실패:", result.error);
        alert(
          `에러 발생: ${result.error.type}\n상세 메시지: ${result.error.message}`
        );
      }
    } catch (error) {
      console.error("요청 처리 중 오류 발생:", error);
      alert("요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <Modal
      open={userProgressStore.modalProgress === "delete-member"}
      onClose={
        userProgressStore.modalProgress === "delete-member"
          ? userProgressStore.handleCloseModal
          : null
      }
    >
      <div id="signout-form">
        <div className="signup-header">
          <h2>연결된 가족 모임 삭제</h2>
          <button type="button" onClick={userProgressStore.handleCloseModal}>
            X
          </button>
        </div>
        <p className="signout-control">
          <label htmlFor="password">비밀번호</label>
          <input type="password" ref={inputPassword} />
          {passwordIsInvalid && (
            <div className="login-control-error">
              <p>비밀번호는 8자 이상입니다.</p>{" "}
            </div>
          )}
          <button className="logout-btn" onClick={handleDeleteMember}>
            연결 해제
          </button>
        </p>
      </div>
    </Modal>
  );
}
