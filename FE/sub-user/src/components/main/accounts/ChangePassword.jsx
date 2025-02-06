import "./Accounts.css";

import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

import Modal from "../../modal/Modal.jsx";

export default function ChangePassword() {
  const userProgressStore = useContext(UserProgressContext);
  const navigate = useNavigate();

  const [newPasswordIsInvalid, setNewPasswordIsInvalid] = useState(false);

  const inputPassword = useRef("");
  const inputNewPassword = useRef("");

  // 가족 삭제 로직
  async function handleChangePassword() {
    // 비밀번호 유효성 검사
    const inputIsInvalid = inputNewPassword.current.value.length < 8;
    if (inputIsInvalid) {
      setNewPasswordIsInvalid(true);
      return;
    }

    userProgressStore.handleCloseModal();

    try {
      const result = await userProgressStore.handleChangePassword(
        inputPassword.current.value,
        inputNewPassword.current.value
      );

      if (result.success === true) {
        // 비번 변경 성공
        alert("비밀번호 변경 성공");

        inputPassword.current.value = "";
        inputNewPassword.current.value = "";

        navigate("/accounts");
      } else {
        userProgressStore.handleOpenModal("change-password");

        console.error("비밀번호 변경 실패:", result.error);
        if (result.error.message === "Invalid password") {
          alert("비밀번호가 일치하지 않습니다.");
        } else {
          alert(
            `에러 발생: ${result.error.type}\n상세 메시지: ${result.error.message}`
          );
        }
      }
    } catch (error) {
      console.error("요청 처리 중 오류 발생:", error);
      alert("요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <Modal
      open={userProgressStore.modalProgress === "change-password"}
      onClose={
        userProgressStore.modalProgress === "change-password"
          ? userProgressStore.handleCloseModal
          : null
      }
    >
      <div id="login-form">
        <div className="signup-header">
          <h2>비밀번호 변경</h2>
          <button type="button" onClick={userProgressStore.handleCloseModal}>
            X
          </button>
        </div>
        <div className="login-control">
          <div className="login-form-row">
            <div className="login-control">
              <label htmlFor="text">현재 비밀번호</label>
              <input type="password" ref={inputPassword} />
            </div>
            <div className="login-control">
              <label htmlFor="password">변경 비밀번호</label>
              <input type="password" ref={inputNewPassword} />
              {newPasswordIsInvalid && (
                <div className="login-control-error">
                  <p>새 비밀번호는 8자 이상이어야 합니다.</p>
                </div>
              )}
              {!newPasswordIsInvalid && (
                <div className="login-control-error">
                  <p> </p>
                </div>
              )}
            </div>
          </div>
          <p className="login-form-action">
            <button className="update-btn" onClick={handleChangePassword}>
              수정
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
