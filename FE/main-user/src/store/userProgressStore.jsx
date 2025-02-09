import { useState, useEffect, createContext } from "react";
import { useMainHttp } from "../hooks/useMainHttp";
import { getEnvironments } from "./environmentsStore.jsx";

export const UserProgressContext = createContext({
  loginUserInfo: {
    login: false, //
    userInfo: undefined,
  },
  familyInfo: {
    isExist: false,
    familyId: undefined,
  },
  DEV_API_URL: "",
  MAIN_API_URL: "",
  DEV_KEY: "",
  MAIN_KEY: "",
  handleLogin: () => {},
  handleLogout: () => {},
});

export default function UserProgressContextProvider({ children }) {
  const { request, loading } = useMainHttp();
  const [loginUserInfo, setLoginUserInfo] = useState({
    login: false, //
    userInfo: undefined,
  });
  const [familyInfo, setFamilyInfo] = useState({
    isExist: false,
    familyId: undefined,
  });

  // 로그인 시 sessionStorage에 저장된 정보 불러오기
  useEffect(() => {
    const storedFamilyId = sessionStorage.getItem("familyId");

    if (storedFamilyId) {
      handleLogin(storedFamilyId);
    }
  }, []);

    // ======================================================================
  // env 관련
  let DEV_API_URL = import.meta.env.VITE_DEV_API;
  let MAIN_API_URL = import.meta.env.VITE_MAIN_API;
  let DEV_KEY = import.meta.env.VITE_DEV_KEY;
  let MAIN_KEY = import.meta.env.VITE_MAIN_KEY;

  if (DEV_API_URL === undefined) DEV_API_URL = getEnvironments("DEV_API_URL");
  if (MAIN_API_URL === undefined) MAIN_API_URL = getEnvironments("MAIN_API_URL");
  if (DEV_KEY === undefined) DEV_KEY = getEnvironments("DEV_KEY");
  if (MAIN_KEY === undefined) MAIN_KEY = getEnvironments("MAIN_KEY");
  // ======================================================================

  /**
   * 🔹 가족 ID(familyId)로 로그인 요청
   * @param {string} familyId 
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async function handleLogin(familyId) {
    try {
      const response = await request(`${DEV_API_URL}/families/${familyId}`, "GET");

      if (response.success) {
        const resData = response.data;

        if (resData.message === "Login successful") {
          console.log("로그인 성공", resData);

          // 로그인 정보 저장
          await handleUpdateSessionLoginInfo({
            login: true,
            userInfo: resData.result.user_data,
          });

          return { success: true, data: resData };
        }
      } else {
        console.error("로그인 실패:", response.error);
        return {
          success: false,
          error: {
            type: response.error.type,
            message: response.error.message,
          },
        };
      }
    } catch (error) {
      console.error("네트워크 오류 또는 기타 예외:", error);
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      };
    }
  }

  /**
   * 🔹 로그아웃 기능
   */
  async function handleLogout() {
    try {
      const response = await request(`${DEV_API_URL}/auth/logout`, "POST");

      if (response.success) {
        const resData = response.data;

        if (resData.message === "Logout successful") {
          console.log("로그아웃 성공");

          setLoginUserInfo({
            login: false,
            userInfo: undefined,
          });

          // 세션 스토리지에서 로그인 정보 삭제
          sessionStorage.removeItem("loginUserInfo");
          sessionStorage.removeItem("session_id");

          // 사이드바 관리
          setIsActiveSideBarElem("accounts");

          // 기본 경로로 이동
          window.location.href = "/";

          // 모달 초기화
          await handleCloseModal();

          // 기기 활성화 요소 초기화 (동기 처리)
          sessionStorage.removeItem("isActiveSideBarElem");

          return { success: true, data: resData };
        }
      } else {
        console.error("로그아웃 실패:", response.error);
        return {
          success: false,
          error: {
            type: response.error?.type || "unknown_error",
            message: response.error?.message || "알 수 없는 오류 발생",
            input: response.error?.input,
          },
        };
      }
    } catch (error) {
      console.error("네트워크 오류 또는 기타 예외:", error);
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      };
    }
  }

  const ctxValue = {
    loginUserInfo,
    familyInfo,
    handleLogin,
    handleLogout,
  };

  return (
    <UserProgressContext.Provider value={ctxValue}>
      {children}
    </UserProgressContext.Provider>
  );
}