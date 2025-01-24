import { useState, createContext } from "react";

export const UserProgressContext = createContext({
  isActiveSideBarElem: "",
  toggleStatus: {},
  sidebarIsOpened: false,
  modalProgress: "",
  loginUserInfo: false,
  DEV_API_URL: "",
  MAIN_API_URL: "",
  DEV_KEY: "",
  MAIN_KEY: "",
  setIsActiveSideBarElem: () => {},
  setToggleStatus: () => {},
  setSidebarIsOpened: () => {},
  setModalProgress: () => {},
  setLoginUserInfo: () => {},
  handleActiveSideBarElem: (identifier) => {},
  handleToggleStatus: (toggle) => {},
  handleSidebarToggle: () => {},
  handleOpenModal: () => {},
  handleCloseModal: () => {},
  handleLogin: (userInfo) => {},
  handleLogout: () => {},
});

export default function UserProgressContextProvider({ children }) {
  // 사이드 바 메뉴 요소 활성화 관련
  const [isActiveSideBarElem, setIsActiveSideBarElem] = useState(undefined);

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

  // 로그인 정보 관리
  const [loginUserInfo, setLoginUserInfo] = useState({
    login: false,
    userInfo: undefined,
  });

  const DEV_API_URL = import.meta.env.VITE_DEV_API;
  const MAIN_API_URL = import.meta.env.VITE_MAIN_API;
  const DEV_KEY = import.meta.env.VITE_DEV_KEY;
  const MAIN_KEY = import.meta.env.VITE_MAIN_KEY;

  // 사이드 바 요소 활성화
  function handleActiveSideBarElem(identifier) {
    setIsActiveSideBarElem(identifier);
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
  function handleOpenModal(identifier) {
    setModalProgress(identifier);
  }

  // 모달 초기화
  function handleCloseModal() {
    setModalProgress("");
  }

  // 로그인
  function handleLogin(userInfo) {
    setLoginUserInfo({
      login: true,
      userInfo,
    });
  }

  // 로그아웃
  function handleLogout() {
    setLoginUserInfo({
      login: false,
      userInfo: undefined,
    });
  }

  const ctxValue = {
    isActiveSideBarElem,
    toggleStatus,
    sidebarIsOpened,
    modalProgress,
    loginUserInfo,
    DEV_API_URL,
    MAIN_API_URL,
    DEV_KEY,
    MAIN_KEY,
    setIsActiveSideBarElem,
    setToggleStatus,
    setSidebarIsOpened,
    setModalProgress,
    setLoginUserInfo,
    handleActiveSideBarElem,
    handleToggleStatus,
    handleSidebarToggle,
    handleOpenModal,
    handleCloseModal,
    handleLogin,
    handleLogout,
  };

  return (
    <UserProgressContext.Provider value={ctxValue}>
      {children}
    </UserProgressContext.Provider>
  );
}
