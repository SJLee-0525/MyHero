import { useState, useEffect, createContext } from "react";

import { getEnvironments } from "./environmentsStore.jsx";
// import { set } from "date-fns";

export const UserProgressContext = createContext({
  isActiveSideBarElem: "",
  toggleStatus: {},
  sidebarIsOpened: false,
  modalProgress: "",
  selectedModalId: "",
  loginUserInfo: {
    login: false,
    userInfo: undefined,
  },
  familyInfo: {
    isExist: false,
    familyInfo: undefined,
    familyMember: [],
  },
  memberInfo: {
    isExist: false,
    registerData: undefined,
  },
  DEV_API_URL: "",
  MAIN_API_URL: "",
  DEV_KEY: "",
  MAIN_KEY: "",
  setIsActiveSideBarElem: () => {},
  setToggleStatus: () => {},
  setSidebarIsOpened: () => {},
  setModalProgress: () => {},
  setSelectedModalId: () => {},
  setLoginUserInfo: () => {},
  setFamilyInfo: () => {},
  setMemberInfo: () => {},
  handleUpdateSessionLoginInfo: (userInfo) => {},
  handleActiveSideBarElem: (identifier) => {},
  handleToggleStatus: (toggle) => {},
  handleSidebarToggle: () => {},
  handleOpenModal: (identifier, id) => {},
  handleCloseModal: () => {},
  handleLogin: (userInfo) => {},
  handleGetUserInfo: (id) => {},
  handleLogout: () => {},
  handleCheckEmail: (email) => {},
  handleSignUp: (payload) => {},
  handleUpdateUserInfo: (payload) => {},
  handleSignOut: (password) => {},
  handleCheckFamilyExist: (userId) => {},
  handleCreateFamily: (payload) => {},
  handleGetFamilyInfo: (familyId) => {},
  handleUpdateFamilyInfo: (newFamilyName) => {},
  handleDeleteFamilyInfo: (password) => {},
  handleGetFamilyMemberInfo: (familyId) => {},
  handleCreateMember: (familyId, nickname) => {},
  handleUpdateMember: (nickname) => {},
  handleDeleteMember: (password) => {},
});

export default function UserProgressContextProvider({ children }) {
  // 사이드 바 메뉴 요소 활성화 관련
  const [isActiveSideBarElem, setIsActiveSideBarElem] = useState("home");

  // 기기 조작 관련
  const [toggleStatus, setToggleStatus] = useState({
    notification: false,
    camera: true,
    microphone: true,
    car: false,
  });

  // 모바일 환경에서 사이드 바 열림 여부 관련
  const [sidebarIsOpened, setSidebarIsOpened] = useState(false);

  // 모달 열림 여부 관련
  const [modalProgress, setModalProgress] = useState("");

  // 모달 선택된 아이디 관련
  const [selectedModalId, setSelectedModalId] = useState("");

  // 로그인 정보 관리
  const [loginUserInfo, setLoginUserInfo] = useState({
    login: false,
    userInfo: undefined,
  });

  // 가족 정보 관리
  const [familyInfo, setFamilyInfo] = useState({
    isExist: false,
    familyInfo: undefined,
    familyMember: undefined,
  });

  const [memberInfo, setMemberInfo] = useState({
    isExist: false,
    registerData: undefined,
  });

  // 페이지 로드 시 로그인 상태 확인 후 활성화된 사이드 바 상태 가져오기
  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("loginUserInfo");

    const storedActiveSideBarElem = sessionStorage.getItem(
      "isActiveSideBarElem"
    );
    if (!storedUserInfo) return;

    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);

        setLoginUserInfo({
          login: true,
          userInfo: parsedUserInfo.userInfo,
        });

        // 사용자 정보 최신화
        handleGetUserInfo(parsedUserInfo.userInfo.id);
      } catch (error) {
        console.error(
          "Error parsing loginUserInfo from sessionStorage:",
          error
        );
        sessionStorage.removeItem("loginUserInfo"); // 손상된 데이터 제거
      }
    }

    try {
      if (storedActiveSideBarElem) {
        setIsActiveSideBarElem(storedActiveSideBarElem);
      }
    } catch (error) {
      console.error(
        "Error parsing isActiveSideBarElem from sessionStorage:",
        error
      );
      sessionStorage.removeItem("isActiveSideBarElem"); // 데이터 손상 시 제거
    }
  }, []);

  // loginUserInfo가 업데이트된 후에 handleCheckFamilyList 호출
  // loginUserInfo가 상태로 관리되고 있다면, setLoginUserInfo 함수가 비동기적으로 실행되기 때문에 바로 loginUserInfo.userInfo.id에 접근할 때 값이 갱신되지 않았을 수 있습니다.
  // 이는 React의 상태 관리 특성 때문에 발생하는 문제로, 상태가 비동기적으로 업데이트되기 때문에 바로 loginUserInfo 값을 사용할 수 없습니다.
  useEffect(() => {
    try {
      if (!loginUserInfo.login) return;

      if (loginUserInfo.login && loginUserInfo.userInfo.id) {
        if (loginUserInfo.userInfo.role === "main") {
          handleCheckFamilyExist(loginUserInfo.userInfo.id);
        } else if (loginUserInfo.userInfo.role === "sub") {
          handleCheckFamilyList();
        }
      }
    } catch (error) {
      console.error("Error checking family list:", error);
    }
  }, [loginUserInfo]);

  // ======================================================================
  // env 관련
  let DEV_API_URL = import.meta.env.VITE_DEV_API;
  let MAIN_API_URL = import.meta.env.VITE_MAIN_API;
  let DEV_KEY = import.meta.env.VITE_DEV_KEY;
  let MAIN_KEY = import.meta.env.VITE_MAIN_KEY;

  if (DEV_API_URL === undefined) DEV_API_URL = getEnvironments("DEV_API_URL");
  if (MAIN_API_URL === undefined)
    MAIN_API_URL = getEnvironments("MAIN_API_URL");
  if (DEV_KEY === undefined) DEV_KEY = getEnvironments("DEV_KEY");
  if (MAIN_KEY === undefined) MAIN_KEY = getEnvironments("MAIN_KEY");
  // ======================================================================

  function handleUpdateSessionLoginInfo(userInfo) {
    setLoginUserInfo({
      login: userInfo.login,
      userInfo: userInfo.userInfo,
    });

    // 로그인 정보 저장
    sessionStorage.setItem("loginUserInfo", JSON.stringify(userInfo));
  }

  // 사이드 바 요소 활성화
  function handleActiveSideBarElem(identifier) {
    setIsActiveSideBarElem(identifier);
    sessionStorage.setItem("isActiveSideBarElem", identifier); // 활성화된 요소 저장

    setSidebarIsOpened(false); // 모바일 환경일 경우 사이드 바 닫음
  }

  // 기기 조작 관련 함수
  function handleToggleStatus(toggle) {
    setToggleStatus((prevStatus) => {
      return { ...prevStatus, [toggle]: !prevStatus[toggle] };
    });
  }

  // 모바일 환경에서 사이드 바 열고 닫기
  function handleSidebarToggle() {
    setSidebarIsOpened((prev) => !prev);
  }

  // 모달 열기
  function handleOpenModal(identifier, id) {
    setModalProgress(identifier);
    setSelectedModalId(id);
  }

  // 모달 초기화
  function handleCloseModal() {
    setModalProgress("");
    setSelectedModalId("");
  }

  // 로그인
  async function handleLogin(email, password) {
    try {
      const response = await fetch(`${DEV_API_URL}/auth/login`, {
        method: "POST",
        credentials: "include", // 로그인을 시도할때나 정보를 요청할때 모두 추가해야함
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "Login successful") {
          console.log("로그인 성공");

          // 로그인 정보 저장
          handleUpdateSessionLoginInfo({
            login: true,
            userInfo: resData.result.user_data,
          });

          return { success: true, data: resData };
        }
      } else {
        console.error("로그인 실패:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
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

  // 최신 회원 정보 조회
  async function handleGetUserInfo(id) {
    try {
      const response = await fetch(
        `${DEV_API_URL}/accounts/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 쿠키 자동 전송
        }
      );

      const resData = await response.json();

      if (response.ok) {
        handleUpdateSessionLoginInfo({
          login: true,
          userInfo: resData.result, // 전체 result 객체 저장
        });

        return { success: true, data: resData };
      } else {
        console.error("회원 정보 조회 실패:", resData.detail);
        return {
          success: false,
          error: {
            type: resData.detail?.type || "unknown_error",
            message: resData.detail?.message || "알 수 없는 오류 발생",
            input: resData.detail?.input,
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

  // 로그아웃
  async function handleLogout() {
    try {
      const sessionId = sessionStorage.getItem("session_id");

      const response = await fetch(`${DEV_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        credentials: "include", // 쿠키 자동 전송
      });

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "Logout successful") {
          console.log("로그아웃 성공");

          setLoginUserInfo({
            login: false,
            userInfo: undefined,
          });

          // 로컬 스토리지에서 로그인 정보 삭제
          sessionStorage.removeItem("loginUserInfo");

          // 세션에서 session_id 삭제
          sessionStorage.removeItem("session_id");

          // 사이드바 관리
          setIsActiveSideBarElem("accounts");

          // 기본 경로로 이동
          window.location.href = "/";

          // 모달 초기화
          handleCloseModal();

          // 사이드바 닫기
          setSidebarIsOpened(false);

          // 기기 활성화 요소 초기화
          sessionStorage.removeItem("isActiveSideBarElem");
        }
      } else {
        console.error("로그아웃 실패:", resData.detail.message);
      }
    } catch (error) {
      console.error("네트워크 오류 또는 기타 예외:", error);
    }
  }

  // 이메일 중복 확인
  async function handleCheckEmail(email) {
    try {
      const response = await fetch(`${DEV_API_URL}/accounts/check-email`, {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (response.ok) {
        // 이메일 사용 가능
        if (resData.message === "Email is available") {
          console.log("이메일 사용 가능:", email);
          return true;
        }
      } else {
        // 이메일 이미 사용 중
        if (resData.detail?.type === "already exists") {
          console.error("이메일 이미 존재:", resData.detail.input.email);
          return false;
        }
      }
    } catch (error) {
      // 네트워크 오류 등 기타 예외 처리
      console.error("네트워크 오류 또는 기타 예외:", error);
      throw new Error("요청을 처리하는 동안 오류가 발생했습니다.");
    }
    return null; // 처리 결과 없음
  }

  // 회원 가입
  async function handleSignUp(payload) {
    try {
      const response = await fetch(`${DEV_API_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // 추가
        },
      });

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "New account created successfully") {
          console.log("회원 가입 성공", resData.result.id);
          handleLogin(payload.email, payload.password); // 회원 가입 후 자동 로그인
          return { success: true, data: resData };
        }
      } else {
        // 서버에서 반환된 에러 정보 처리
        console.error("에러 유형:", resData.detail.type);
        console.error("에러 메시지:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
            input: resData.detail.input,
          },
        };
      }
    } catch (error) {
      // 네트워크 오류 처리
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

  // 회원 정보 수정
  async function handleUpdateUserInfo(payload) {
    const isConfirmed = window.confirm(
      '정말 회원 정보를 수정하시겠습니까?\n"확인"을 누르면 수정이 완료됩니다.'
    );
    if (!isConfirmed) {
      console.log("회원 수정 취소");
      return {
        success: false,
        error: { type: "canceled", message: "사용자가 취소했습니다." },
      };
    }

    try {
      const response = await fetch(
        `${DEV_API_URL}/accounts/${loginUserInfo.userInfo.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (response.ok && resData.message === "Account updated successfully") {
        // 최신 회원 정보 가져오기
        const updatedUser = await handleGetUserInfo(loginUserInfo.userInfo.id);
        console.log("최신 회원 정보 응답:", updatedUser);

        if (!updatedUser || !updatedUser.success) {
          console.error("회원 정보 갱신 실패:", updatedUser);
          return { success: false, error: { message: "회원 정보 조회 실패" } };
        }

        // 상태 업데이트
        const newUserInfo = {
          login: true,
          userInfo: updatedUser.data.result,
        };
        setLoginUserInfo(newUserInfo);
        sessionStorage.setItem("loginUserInfo", JSON.stringify(newUserInfo));

        return { success: true, data: resData };
      } else {
        console.error("에러 유형:", resData.detail?.type);
        console.error("에러 메시지:", resData.detail?.message);
        return {
          success: false,
          error: {
            type: resData.detail?.type,
            message: resData.detail?.message,
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

  // 회원 탈퇴
  async function handleSignOut(password) {
    const isConfirmed = window.confirm(
      `정말 회원 탈퇴하시겠습니까?\n탈퇴 시 복구가 불가능합니다.`
    );
    if (!isConfirmed) {
      console.log("회원 탈퇴 취소");
      return {
        success: false,
        error: { type: "canceled", message: "사용자가 취소했습니다." },
      };
    }

    console.log(password);
    try {
      const response = await fetch(
        `${DEV_API_URL}/accounts/${loginUserInfo.userInfo.id}`,
        {
          method: "DELETE",
          body: JSON.stringify({ password: password }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (response.ok) {
        // 회원 탈퇴 성공
        if (resData.message === "Account deleted successfully") {
          setLoginUserInfo({
            login: false,
            userInfo: undefined,
          });

          // 로컬 스토리지에서 로그인 정보 삭제
          sessionStorage.removeItem("loginUserInfo");

          // 세션에서 session_id 삭제
          sessionStorage.removeItem("session_id");

          // 사이드바 관리
          setIsActiveSideBarElem("accounts");

          // 기본 경로로 이동
          window.location.href = "/";

          // 모달 초기화
          handleCloseModal();

          // 사이드바 닫기
          setSidebarIsOpened(false);

          // 기기 활성화 요소 초기화
          sessionStorage.removeItem("isActiveSideBarElem");

          console.log("회원 탈퇴 성공");
          return { success: true };
        }
      } else {
        // 잘못된 비밀번호 입력
        if (resData.detail.type === "unauthorized") {
          console.error("잘못된 비밀번호 입력");
        } else if (resData.detail.type === "Password is required") {
          console.error("비밀번호 입력은 필수입니다");
        }
        console.log(resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
          },
        };
      }
    } catch (error) {
      // 네트워크 오류 등 기타 예외 처리
      console.error("네트워크 오류 또는 기타 예외:", error);
      throw new Error("요청을 처리하는 동안 오류가 발생했습니다.");
    }
  }

  async function handleCheckFamilyExist(userId) {
    // console.log(userId);

    try {
      const response = await fetch(`${DEV_API_URL}/families/check-exist`, {
        method: "POST",
        body: JSON.stringify({ id: userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "Family exists") {
          console.log("가족 존재함");

          // 가족 정보 조회
          // const familyId = resData.result.family_id;
          handleGetFamilyInfo(resData.result.family_id);

          return { success: true, data: resData };
        }
      } else {
        console.log("가족 모임 존재하지 않음");
        return { success: false, data: resData };
      }
    } catch (error) {
      console.error("네트워크 오류 또는 기타 예외:", error);
      throw new Error("요청을 처리하는 동안 오류가 발생했습니다.");
    }
  }

  // 가족 생성
  async function handleCreateFamily(payload) {
    const isConfirmed = window.confirm(
      `${payload.family_name}으로 가족 모임 생성을 하시겠습니까?\n확인을 누르면 가족이 생성됩니다.`
    );
    if (!isConfirmed) {
      console.log("가족 모임 생성 취소");
      return {
        success: false,
        error: { type: "canceled", message: "사용자가 취소했습니다." },
      };
    }

    console.log(payload);
    const sessionId = sessionStorage.getItem("session_id");

    try {
      const response = await fetch(`${DEV_API_URL}/families`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        credentials: "include", // 쿠키 자동 전송
      });

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "New family created successfully") {
          console.log("가족 모임 생성 성공");

          // 가족 생성 후 가족 정보 조회
          const familyId = resData.result.id;
          handleGetFamilyInfo(familyId);

          return { success: true, data: resData };
        } else {
          console.error("가족 생성 실패:", resData.detail.message);
          return {
            success: false,
            error: {
              type: resData.detail.type,
              message: resData.detail.message,
            },
          };
        }
      }
    } catch (error) {
      console.error("네트워크 오류 또는 기타 예외:", error);
      throw new Error("요청을 처리하는 동안 오류가 발생했습니다.");
    }
  }

  // 가족 구성원 조회 및 정보 저장
  async function handleGetFamilyInfo(familyId) {
    try {
      const response = await fetch(`${DEV_API_URL}/families/${familyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "Family retrieved successfully") {
          console.log("가족 구성원 조회 성공");

          // 추후 가족 구성원 저장도 같이할 예정
          setFamilyInfo({
            isExist: true,
            familyInfo: resData.result,
          });

          handleGetFamilyMemberInfo(resData.result.id);

          return { success: true, data: resData };
        }
      } else {
        // 서버에서 반환된 에러 정보 처리
        console.error("에러 유형:", resData.detail.type);
        console.error("에러 메시지:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
            input: resData.detail.input,
          },
        };
      }
    } catch (error) {
      // 네트워크 오류 처리
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

  // 가족 정보 수정
  async function handleUpdateFamilyInfo(newFamilyName) {
    const isConfirmed = window.confirm(
      "정말 가족 모임 정보를 변경하시겠습니까?\n확인을 누르면 변경됩니다."
    );
    if (!isConfirmed) {
      console.log("가족 정보 변경 취소");
      return {
        success: false,
        error: { type: "canceled", message: "사용자가 취소했습니다." },
      };
    }

    try {
      const response = await fetch(
        `${DEV_API_URL}/families/${familyInfo.familyInfo.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            family_name: newFamilyName,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "Family updated successfully") {
          console.log("가족 모임 정보 수정 성공");

          // 가족 정보 다시 조회
          handleGetFamilyInfo(familyInfo.familyInfo.id);

          return { success: true, data: resData };
        }
      } else {
        console.error("가족 모임 정보 수정 실패:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
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

  // 가족 정보 삭제
  async function handleDeleteFamilyInfo(password) {
    const isConfirmed = window.confirm(
      "정말 가족 모임을 삭제하시겠습니까?\n삭제 시 복구가 불가능합니다."
    );
    if (!isConfirmed) {
      console.log("가족 정보 삭제 취소");
      return {
        success: false,
        error: { type: "canceled", message: "삭제 취소." },
      };
    }

    // console.log(password);
    try {
      const response = await fetch(
        `${DEV_API_URL}/families/${familyInfo.familyInfo.id}`,
        {
          method: "DELETE",
          body: JSON.stringify({ password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "Family deleted successfully") {
          console.log("가족 모임 삭제 성공");

          // 가족 정보 상태 초기화
          setFamilyInfo({
            isExist: false,
            familyInfo: undefined,
          });

          return { success: true, data: resData };
        }
      } else {
        console.error("가족 모임 삭제 실패:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
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

  // 등록된 가족 모임 조회
  async function handleCheckFamilyList() {
    try {
      const response = await fetch(
        `${DEV_API_URL}/members?userId=${encodeURIComponent(
          loginUserInfo.userInfo.id
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "All members retrieved successfully") {
          console.log("가족 목록 조회 성공");

          // 정보 갱신
          setMemberInfo({
            isExist: true,
            registerData: resData.result,
          });

          return { success: true, data: resData };
        } else if (resData.message === "No members found") {
          console.log("가족 목록 없음");

          // 정보 갱신
          setMemberInfo({
            isExist: false,
            registerData: undefined,
          });
        }
        return { success: true, data: resData };
      } else {
        console.error("가족 목록 조회 실패:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
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

  // 가족 구성원 조회
  async function handleGetFamilyMemberInfo(familyId) {
    try {
      const response = await fetch(
        `${DEV_API_URL}/members?familyId=${encodeURIComponent(familyId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "All members retrieved successfully") {
          console.log("가족 구성원 조회 성공");
          console.log(resData.result);

          // 정보 갱신
          setFamilyInfo((prev) => {
            return {
              ...prev,
              familyMember: resData.result,
            };
          });
        } else if (resData.message === "No members found") {
          console.log("가족 구성원 없음");

          // 정보 갱신
          setFamilyInfo((prev) => {
            return {
              ...prev,
              familyMember: [],
            };
          });
        }
        return { success: true, data: resData };
      } else {
        console.error("가족 구성원 조회 실패:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
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

  // 가족 구성원 추가
  async function handleCreateMember(payload) {
    const { familyId, nickname } = payload;

    try {
      const response = await fetch(`${DEV_API_URL}/members`, {
        method: "POST",
        body: JSON.stringify({
          family_id: familyId,
          user_id: loginUserInfo.userInfo.id,
          nickname: nickname,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "New member created successfully") {
          console.log("가족 구성원 추가 성공");

          // 정보 갱신
          handleCheckFamilyList();

          return { success: true, data: resData };
        }
      } else {
        console.error("가족 구성원 추가 실패:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
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

  // 가족 구성원 닉네임 수정
  async function handleUpdateMember(nickname) {
    try {
      const response = await fetch(
        `${DEV_API_URL}/members/${encodeURIComponent(selectedModalId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ nickname: nickname }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "Member updated successfully") {
          console.log("구성원 정보 수정 성공");

          // 정보 갱신
          handleCheckFamilyList();

          return { success: true, data: resData };
        }
      } else {
        console.error("구성원 정보 수정 실패:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
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

  // 가족 구성원 삭제
  async function handleDeleteMember(password) {
    try {
      const response = await fetch(
        `${DEV_API_URL}/members/${selectedModalId}`,
        {
          method: "DELETE",
          body: JSON.stringify({ password: password }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (response.ok) {
        if (resData.message === "Member deleted successfully") {
          console.log("구성원 삭제 성공");

          // 정보 갱신
          handleCheckFamilyList();

          return { success: true, data: resData };
        }
      } else {
        console.error("구성원 삭제 실패:", resData.detail.message);
        return {
          success: false,
          error: {
            type: resData.detail.type,
            message: resData.detail.message,
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
    isActiveSideBarElem,
    toggleStatus,
    sidebarIsOpened,
    modalProgress,
    selectedModalId,
    loginUserInfo,
    familyInfo,
    memberInfo,
    DEV_API_URL,
    MAIN_API_URL,
    DEV_KEY,
    MAIN_KEY,
    setIsActiveSideBarElem,
    setToggleStatus,
    setSidebarIsOpened,
    setModalProgress,
    setSelectedModalId,
    setLoginUserInfo,
    setFamilyInfo,
    setMemberInfo,
    handleUpdateSessionLoginInfo,
    handleActiveSideBarElem,
    handleToggleStatus,
    handleSidebarToggle,
    handleOpenModal,
    handleCloseModal,
    handleLogin,
    handleGetUserInfo,
    handleLogout,
    handleCheckEmail,
    handleSignUp,
    handleSignOut,
    handleUpdateUserInfo,
    handleCheckFamilyExist,
    handleCreateFamily,
    handleGetFamilyInfo,
    handleUpdateFamilyInfo,
    handleDeleteFamilyInfo,
    handleCheckFamilyList,
    handleGetFamilyMemberInfo,
    handleCreateMember,
    handleUpdateMember,
    handleDeleteMember,
  };

  return (
    <UserProgressContext.Provider value={ctxValue}>
      {children}
    </UserProgressContext.Provider>
  );
}
