import "./Accounts.css";

import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import PageContainer from "../container/PageContainer.jsx";
import UpdateUserInfo from "./UpdateUserInfo.jsx";
import Signout from "./Signout.jsx";

export default function UserInfo() {
  const userProgressStore = useContext(UserProgressContext);
  const navigate = useNavigate();

  const inputPassword = useRef("");

  function handleLogout(event) {
    event.preventDefault();

    userProgressStore.handleLogout();
  }

  function handleShowUpdateUserInfo() {
    userProgressStore.handleOpenModal("update-user-info");
  }

  async function handleShowSignOut() {
    userProgressStore.handleOpenModal("sign-out");
  }

  return (
    <PageContainer title="유저 정보">
      <p className="login-form-action">
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
        <button className="logout-btn" onClick={handleShowUpdateUserInfo}>
          회원 정보 수정
        </button>
        <button className="logout-btn" onClick={handleShowSignOut}>
          회원 탈퇴
        </button>
      </p>
      <UpdateUserInfo />
      <Signout />
    </PageContainer>
  );
}
