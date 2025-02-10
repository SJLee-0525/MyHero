import { useRef, useContext } from "react";
import { UserProgressContext } from "../../store/userProgressStore.jsx";
import "./Login.css";

export default function Login() {
  const userProgressStore = useContext(UserProgressContext);
  const familyIdInput = useRef("");

  async function handleLogin(event) {
    event.preventDefault();
    const familyId = familyIdInput.current.value.trim();
    const response = await userProgressStore.handleLogin(familyId);

    // 로그인 실패 시
    if (!response.success) {
        alert("존재하지 않는 가족 ID입니다.");
    } 

  }

  return (
    <>
      <form id="login-form" onSubmit={handleLogin}>
        <div className="login-header">
          <h2>영웅이네 오신 것을 환영합니다.</h2>
        </div>
        <div className="login-form-row">
          <div className="login-control">
            <label htmlFor="familyId">가족 ID</label>
            <input type="text" name="familyId" placeholder="가족ID를 입력해주세요." ref={familyIdInput} />
          </div>
        </div>
        <p className="login-form-action">
          <button type="submit" className="login-btn">로그인</button>
        </p>
      </form>
    </>
  );
}