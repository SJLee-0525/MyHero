import "./Accounts.css";

import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserProgressContext } from "../../../store/userProgressStore.jsx";

// import PageContainer from "../container/PageContainer.jsx"
import Signup from "./Signup.jsx";

export default function Login() {
  const userProgressStore = useContext(UserProgressContext);
  const navigate = useNavigate();

  // 유효성 검사 상태
  const [formIsInvalid, setFormIsInvalid] = useState({
    email: false,
    password: false,
  });

  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const emailInput = useRef("");
  const passwordInput = useRef("");

  const handleKeyDown = (event) => {
    if (event.getModifierState("CapsLock")) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  const handleKeyUp = (event) => {
    if (!event.getModifierState("CapsLock")) {
      setIsCapsLockOn(false);
    }
  };

  async function handleLogin(event) {
    event.preventDefault();

    // 이메일 유효성 검사
    const emailIsInvalid = !emailInput.current.value.includes("@");
    if (emailIsInvalid) {
      setFormIsInvalid((prevForm) => {
        alert("유효한 이메일을 입력해 주세요.");
        return { ...prevForm, email: true };
      });
      return;
    } else {
      setFormIsInvalid((prevForm) => {
        return { ...prevForm, email: false };
      });
    }

    // 비밀번호 유효성 검사
    const passwordIsInvalid = passwordInput.current.value.length < 8;
    if (passwordIsInvalid) {
      setFormIsInvalid((prevForm) => {
        alert("비밀번호는 8자 이상입니다.");
        return { ...prevForm, password: true };
      });
      return;
    } else {
      setFormIsInvalid((prevForm) => {
        return { ...prevForm, password: false };
      });
    }

    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    userProgressStore.handleCloseModal();

    const response = await userProgressStore.handleLogin(email, password);

    if (response.success) {
      navigate("/");
      return;
    }
    if (!response.success) {
      userProgressStore.setModalProgress("login");

      if (response.error.message === "Invalid email or password") {
        alert("이메일 또는 비밀번호가 일치하지 않습니다.");
      } else {
        alert(`로그인 실패:\n${response.error.message}`);
      }
    }
  }

  function handleShowSignUp() {
    userProgressStore.setModalProgress("sign-up");
  }
  return (
    <>
      <form id="login-form" onSubmit={handleLogin}>
        <div className="login-header">
          <h2>영웅이네 오신 것을 환영합니다.</h2>
          <button
            type="button"
            onClick={() => userProgressStore.handleCloseModal()}
          >
            X
          </button>
        </div>
        <div className="login-form-row">
          <div className="login-control">
            <label htmlFor="email">이메일 아이디</label>
            <input
              type="email"
              name="email"
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              ref={emailInput}
            />

            {/* {formIsInvalid.email && (
              <div className="login-control-error">
                <p>유효한 이메일을 입력해 주세요.</p>
              </div>
            )} */}
          </div>

          {isCapsLockOn && (
            <div className="login-control-error">
              <p>⚠️ Caps Lock이 켜져 있습니다!</p>
            </div>
          )}
          {!isCapsLockOn && (
            <div className="login-control-error">
              <p> </p>
            </div>
          )}

          <div className="login-control">
            <label htmlFor="password">비밀번호</label>
            <input
              // id="password"
              type="password"
              name="password"
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              ref={passwordInput}
            />
          </div>

          {/* {formIsInvalid.password && (
            <div className="login-control-error">
              <p>비밀번호는 8자 이상입니다.</p>{" "}
            </div>
          )} */}
        </div>

        <p className="login-form-action">
          <button type="submit" className="login-btn">
            Login
          </button>
          <button
            type="button"
            className="signup-btn"
            onClick={handleShowSignUp}
          >
            Sign Up
          </button>
        </p>
      </form>
      <Signup />
    </>
  );
}
