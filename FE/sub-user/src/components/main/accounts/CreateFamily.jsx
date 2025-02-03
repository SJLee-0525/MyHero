import "./Accounts.css";

import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import Modal from "../../modal/Modal.jsx";

export default function handleCreateFamily() {
  const userProgressStore = useContext(UserProgressContext);
  const navigate = useNavigate();

  const [nameIsInvalid, setNameIsInvalid] = useState(false);

  const inputName = useRef("");

  async function handleCreateFamily(event) {
    event.preventDefault();

    // 가족 이름 유효성 검사
    const invalid = inputName.current.value.length < 2;
    if (invalid) {
      setNameIsInvalid(true);
      return;
    } else {
      setNameIsInvalid(false);
    }

    // 입력받은 데이터 객체화
    const payload = {
      main_user: userProgressStore.loginUserInfo.userInfo.id,
      family_name: inputName.current.value,
    };

    try {
      const result = await userProgressStore.handleCreateFamily(payload);
      if (result.success === true) {
        // 가족 생성 성공
        alert("가족 생성 성공");
        userProgressStore.handleCloseModal();
        navigate("/accounts");
      } else {
        console.error("가족 생성 실패:", result.error);
        alert(
          `에러 발생: ${result.error.type}\n상세 메시지: ${result.error.message}`
        );
      }
    } catch (error) {
      console.error("요청 처리 중 오류 발생:", error);
      alert("요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  }

  // 회원 탈퇴 로직
  async function handleSignOut() {
    // 비밀번호 유효성 검사
    const inputIsInvalid = inputPassword.current.value.length < 8;
    if (inputIsInvalid) {
      setPasswordIsInvalid(true);
      return;
    }

    try {
      const result = await userProgressStore.handleSignOut(
        inputPassword.current.value
      );

      if (result.success === true) {
        // 회원 탈퇴 성공
        alert("회원 탈퇴 성공");
        userProgressStore.handleCloseModal();
        navigate("/accounts");
      } else {
        console.error("회원 탈퇴 실패:", result.error);
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
      open={userProgressStore.modalProgress === "create-family-user-info"}
      onClose={
        userProgressStore.modalProgress === "create-family-user-info"
          ? userProgressStore.handleCloseModal
          : null
      }
    >
      <div id="signup-form">
        <div className="signup-header">
          <h2>가족 생성</h2>
          <button type="button" onClick={userProgressStore.handleCloseModal}>
            X
          </button>
        </div>
        <p className="signup-control">
          <label htmlFor="text">가족 이름</label>
          <input type="text" ref={inputName} />
          {nameIsInvalid && (
            <div className="signup-control-error">
              <p>가족 이름은 2글자 이상이어야 합니다.</p>
            </div>
          )}
          <button className="signup-btn" onClick={handleCreateFamily}>
            생성
          </button>
        </p>
      </div>
    </Modal>
  );
}
