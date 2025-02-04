import "./Accounts.css";

import { useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

export default function MemberUserInfo() {
  const userProgressStore = useContext(UserProgressContext);
  const loginUserInfo = userProgressStore.loginUserInfo;
  const memberUserInfo = userProgressStore.memberInfo;

  function handleShowCreateMemberUserInfo() {
    userProgressStore.handleOpenModal("create-member-user-info");
  }

  //   function handleShowUpdateFamilyUserInfo() {
  //     userProgressStore.handleOpenModal("update-family-user-info");
  //   }

  //   function handleShowDeleteFamilyUserInfo() {
  //     userProgressStore.handleOpenModal("delete-family");
  //   }

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
                  <p>{info.nickname}</p>
                  <hr />
                </div>
              );
            })}
          </div>
          {/* <div className="login-user-info-header">
            <h3>{familyUserInfo.familyInfo.family_name}네 모임 정보</h3>
            <button onClick={handleShowUpdateFamilyUserInfo}>
              가족 정보 수정
            </button>
            <button onClick={handleShowDeleteFamilyUserInfo}>
              가족 정보 삭제
            </button>
          </div>
          <table>
            <tr>
              <td>이름</td>
              <td>
                {loginUserInfo.userInfo.user_name
                  ? loginUserInfo.userInfo.user_name
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>성별</td>
              {loginUserInfo.userInfo.gender === "male" && <td>남성</td>}
              {loginUserInfo.userInfo.gender === "female" && <td>여성</td>}
              {!loginUserInfo.userInfo.gender && <td>-</td>}
            </tr>
            <tr>
              <td>생년월일</td>
              <td>
                {loginUserInfo.userInfo.birth_date
                  ? loginUserInfo.userInfo.birth_date
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>거주지</td>
              <td>
                {loginUserInfo.userInfo.address
                  ? loginUserInfo.userInfo.address
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>가입 이메일</td>
              <td>
                {loginUserInfo.userInfo.email
                  ? loginUserInfo.userInfo.email
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>역할</td>
              {loginUserInfo.userInfo.role === "main" && <td>주 사용자</td>}
              {loginUserInfo.userInfo.role === "sub" && <td>보조 사용자</td>}
              {!loginUserInfo.userInfo.role && <td>-</td>}
            </tr>
          </table> */}
        </div>
      )}
    </>
  );
}
