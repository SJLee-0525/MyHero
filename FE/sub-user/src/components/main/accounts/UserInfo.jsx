import "./Accounts.css";

import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import PageContainer from "../container/PageContainer.jsx";

export default function UserInfo() {
  const userProgressStore = useContext(UserProgressContext);
  const navigate = useNavigate();

  const inputPassword = useRef("");

  function handleLogout(event) {
    event.preventDefault();

    userProgressStore.handleLogout();
  }

  async function handleSignOut() {
    try {
      const result = await userProgressStore.handleSignOut(
        inputPassword.current.value
      );

      if (result.success === true) {
        // 회원 탈퇴 성공
        alert("회원 탈퇴 성공");
        navigate("/");
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
    <PageContainer title="유저 정보">
      <p className="login-form-action">
        <input type="password" ref={inputPassword} />
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
        <button className="logout-btn" onClick={handleSignOut}>
          회원 탈퇴
        </button>
      </p>
    </PageContainer>
  );
}
