import "./Accounts.css";

import { useContext } from "react";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

export default function FamilyUserInfo() {
  const userProgressStore = useContext(UserProgressContext);
  const loginUserInfo = userProgressStore.loginUserInfo;
  const familyUserInfo = userProgressStore.familyInfo;

  function handleShowCreateFamilyUserInfo() {
    userProgressStore.handleOpenModal("create-family-user-info");
  }

  function handleShowUpdateFamilyUserInfo() {
    userProgressStore.handleOpenModal("update-family-user-info");
  }

  return (
    <>
      {!familyUserInfo.isExist && (
        <div id="login-user-info">
          <div className="not-found-family-user-info">
            <h3>등록된 가족 정보가 없습니다.</h3>
            <button onClick={handleShowCreateFamilyUserInfo}>
              가족 정보 등록
            </button>
          </div>
        </div>
      )}
      {familyUserInfo.isExist && (
        <>
          <div className="login-user-info-header">
            <h3>{familyUserInfo.familyInfo.family_name}네 가족 정보</h3>
            <button>등록 정보 수정</button>
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
          </table>
        </>
      )}
    </>
  );
}
