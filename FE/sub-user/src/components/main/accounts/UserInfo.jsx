import "./Accounts.css";

import { useState, useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import PageContainer from "../container/PageContainer.jsx";

export default function UserInfo() {
  const userProgressStore = useContext(UserProgressContext);

  function handleLogout(event) {
    event.preventDefault();

    userProgressStore.handleLogout();
  }

  return (
    <PageContainer title="유저 정보">
      <p className="login-form-action">
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </p>
    </PageContainer>
  );
}
