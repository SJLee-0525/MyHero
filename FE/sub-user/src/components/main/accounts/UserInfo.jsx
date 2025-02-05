import "./Accounts.css";

import { useState, useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import PageContainer from "../container/PageContainer.jsx";
import LoginUserInfo from "./LoginUserInfo.jsx";
import FamilyUserInfo from "./FamilyUserInfo.jsx";
import MemberUserInfo from "./MemberUserInfo.jsx";

// 모달 컴포넌트들
import UpdateUserInfo from "./UpdateUserInfo.jsx";
import CreateFamily from "./CreateFamily.jsx";
import Signout from "./Signout.jsx";
import UpdateFamily from "./UpdateFamily.jsx";
import DeleteFamily from "./DeleteFamily.jsx";
import CreateMember from "./CreateMember.jsx";
import UpdateMember from "./UpdateMember.jsx";
import DeleteMember from "./DeleteMember.jsx";
import ChangePassword from "./ChangePassword.jsx";

export default function UserInfo() {
  const userProgressStore = useContext(UserProgressContext);
  const loginUserInfo = userProgressStore.loginUserInfo;

  const [selectedUserInfo, setSelectedUserInfo] = useState("loginUserInfo");

  function handleLogout(event) {
    event.preventDefault();

    userProgressStore.handleLogout();
  }

  async function handleShowSignOut() {
    userProgressStore.handleOpenModal("sign-out");
  }

  if (!loginUserInfo.login) return null;

  // console.log(loginUserInfo);

  return (
    <PageContainer title="유저 정보">
      <div id="user-info">
        <div id="user-info-btn-container">
          <button
            className={
              selectedUserInfo === "loginUserInfo"
                ? "selected-btn"
                : "unselected-btn"
            }
            onClick={() => setSelectedUserInfo("loginUserInfo")}
          >
            로그인 유저 정보
          </button>
          <button
            className={
              selectedUserInfo === "familyUserInfo"
                ? "selected-btn"
                : "unselected-btn"
            }
            onClick={() => setSelectedUserInfo("familyUserInfo")}
          >
            등록된 모임 정보
          </button>
        </div>
        {selectedUserInfo === "loginUserInfo" && <LoginUserInfo />}
        {selectedUserInfo === "familyUserInfo" &&
          loginUserInfo.userInfo.role === "main" && <FamilyUserInfo />}
        {selectedUserInfo === "familyUserInfo" &&
          loginUserInfo.userInfo.role === "sub" && <MemberUserInfo />}

        <div className="login-form-action">
          <div className="danger-zone">
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>

            <button className="logout-btn" onClick={handleShowSignOut}>
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
      <UpdateUserInfo />
      <CreateFamily />
      <Signout />
      <UpdateFamily />
      <DeleteFamily />
      <CreateMember />
      <UpdateMember />
      <DeleteMember />
      <ChangePassword />
    </PageContainer>
  );
}
