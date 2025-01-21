import "./Accounts.css";

import { useRef, useState } from "react";

import PageContainer from "../container/PageContainer.jsx";

export default function Signup() {
  const inputEmail = useRef("");
  const [emailCheck, setEmailCheck] = useState("");

  function handleEmailCheck(event) {
    const enteredEmail = inputEmail.current.value;
    console.log("enteredEmail: " + enteredEmail);

    setEmailCheck("verified");
    // setEmailCheck("not-verified");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);

    // 입력된 모든 값들을 그룹화
    const data = Object.fromEntries(fd.entries());
    console.log(data);
  }

  return (
    <PageContainer title="회원 가입">
      <form id="signup-form" onSubmit={handleSubmit}>
        <h2>영웅이 가입을 환영합니다.</h2>
        <p>블라블라</p>

        <div className="signup-control">
          <label htmlFor="email">Email</label>
          <div className="signup-wrapper">
            <input
              id="email"
              className="email-input"
              type="email"
              name="email"
              ref={inputEmail}
              required
            />
            {emailCheck === "" && (
              <button
                type="button"
                onClick={handleEmailCheck}
                className="email-check"
              >
                중복 확인
              </button>
            )}
            {emailCheck === "verified" && (
              <button type="button" className="email-verified" disabled>
                확인됨
              </button>
            )}
            {emailCheck === "not-verified" && (
              <button
                type="button"
                onClick={handleEmailCheck}
                className="email-not-verified"
              >
                중복됨
              </button>
            )}
          </div>
        </div>

        <div className="signup-control-row">
          <div className="signup-control">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" required />
          </div>

          <div className="signup-control">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              name="confirm-password"
              required
            />
          </div>
        </div>

        <hr />

        <div className="signup-control-row">
          <div className="signup-wrapper">
            <div className="signup-control">
              <label htmlFor="user_name">Name</label>
              <input type="text" id="user-name" name="user_name" required />
            </div>

            <div className="signup-control">
              <label htmlFor="birth_date">Birth Day</label>
              <input type="date" id="birth-date" name="birth_date" required />
            </div>
          </div>

          <div className="signup-control">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" required />
          </div>
        </div>

        <div className="signup-control-row">
          <div className="signup-wrapper">
            <div className="signup-control">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="signup-control">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" required>
                <option value="main">Main</option>
                <option value="sub">Sub</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="signup-btn">
          Sign up
        </button>
        <button type="reset" className="reset-btn">
          Reset
        </button>
      </form>
    </PageContainer>
  );
}
