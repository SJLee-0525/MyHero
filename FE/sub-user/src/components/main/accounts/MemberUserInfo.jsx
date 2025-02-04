import "./Accounts.css";

import { useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

export default function MemberUserInfo() {
  const userProgressStore = useContext(UserProgressContext);
  // const loginUserInfo = userProgressStore.loginUserInfo;
  const memberUserInfo = userProgressStore.memberInfo;

  function handleShowCreateMemberUserInfo() {
    userProgressStore.handleOpenModal("create-member-user-info");
  }

  function handleShowUpdateMemberUserInfo(id) {
    userProgressStore.handleOpenModal("update-member-user-info", id);
  }

  function handleShowDeleteMemberUserInfo(id) {
    userProgressStore.handleOpenModal("delete-member", id);
  }

  return (
    <>
      {!memberUserInfo.isExist && (
        <div id="login-user-info">
          <div className="not-found-family-user-info">
            {!memberUserInfo.isExist && (
              <h3>연결된 가족 모임 정보가 없습니다.</h3>
            )}
            <button onClick={handleShowCreateMemberUserInfo}>
              가족 모임 연결
            </button>
          </div>
        </div>
      )}
      {memberUserInfo.isExist && (
        <div>
          <div id="login-user-info">
            <button onClick={handleShowCreateMemberUserInfo}>
              가족 모임 연결
            </button>
          </div>
          <div>
            {memberUserInfo.registerData.map((info) => {
              return (
                <div key={info.id}>
                  <p>id: {info.id}</p>
                  <p>family_id: {info.family_id}</p>
                  <p>user_id: {info.user_id}</p>
                  <p>nickname: {info.nickname}</p>
                  <button
                    onClick={() => handleShowUpdateMemberUserInfo(info.id)}
                  >
                    닉네임 수정
                  </button>
                  <button
                    onClick={() => handleShowDeleteMemberUserInfo(info.id)}
                  >
                    연결 해제
                  </button>
                  <hr />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
