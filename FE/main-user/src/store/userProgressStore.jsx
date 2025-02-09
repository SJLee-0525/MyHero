import { useState, useEffect, createContext } from "react";
import { useMainHttp } from "../hooks/useMainHttp";

export const UserProgressContext = createContext({
  loginUserInfo: {
    login: false,
    userInfo: undefined,
  },
  familyInfo: {
    isExist: false,
    familyId: undefined,
  },
  handleLogin: () => {},
  handleLogout: () => {},
});

export default function UserProgressContextProvider({ children }) {
  const { request, loading } = useMainHttp();
  const [loginUserInfo, setLoginUserInfo] = useState({
    login: false,
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

  /**
   * 🔹 가족 ID(familyId)로 로그인 요청
   * @param {string} familyId 
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async function handleLogin(familyId) {
    try {
      const response = await request(`/auth/login/${familyId}`, "GET");

      // console.log("서버 응답:", response);
      
      // if (typeof response.json === "function") {
      //   const responseData = await response.json();
      //   console.log("서버 응답 (JSON 변환 후):", responseData);
      // } else {
      //   console.log("response가 JSON을 변환할 수 없는 형태:", response);
      // }

      if (response.success) {
        console.log("로그인 성공:", response.data);

        setLoginUserInfo({
          login: true,
          userInfo: response.data.userInfo || {},
        });

        setFamilyInfo({
          isExist: true,
          familyId: familyId,
        });

        sessionStorage.setItem("familyId", familyId);

        return { success: true, data: response.data };
      } else {
        console.error("로그인 실패:", response.error);
        return { success: false, error: "잘못된 가족 ID입니다." };
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
      return { success: false, error: "네트워크 오류가 발생했습니다." };
    }
  }

  /**
   * 🔹 로그아웃 기능
   */
  async function handleLogout() {
    try {
      await request("/auth/logout", "POST");

      setLoginUserInfo({
        login: false,
        userInfo: undefined,
      });

      setFamilyInfo({
        isExist: false,
        familyId: undefined,
      });

      sessionStorage.removeItem("familyId");

      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error);
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