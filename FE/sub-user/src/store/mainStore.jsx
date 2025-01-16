import { useState, createContext } from "react";

export const MainStoreContext = createContext({
  isActiveSideBarElem: "",
  toggleStatus: {},
  setIsActiveSideBarElem: () => {},
  setToggleStatus: () => {},
  handleActiveSideBarElem: () => {},
  handleToggleStatus: () => {},
});

export default function MainStoreContextProvider({ children }) {
  const [isActiveSideBarElem, setIsActiveSideBarElem] = useState(undefined);

  const [toggleStatus, setToggleStatus] = useState({
    toggle1: false,
    toggle2: true,
    toggle3: true,
    toggle4: false,
  });

  function handleActiveSideBarElem(identifier) {
    setIsActiveSideBarElem(identifier);
  }

  function handleToggleStatus(toggle) {
    setToggleStatus((prevStatus) => {
      return { ...prevStatus, [toggle]: !prevStatus[toggle] };
    });
  }

  const ctxValue = {
    isActiveSideBarElem,
    toggleStatus,
    setIsActiveSideBarElem,
    setToggleStatus,
    handleActiveSideBarElem,
    handleToggleStatus,
  };

  return (
    <MainStoreContext.Provider value={ctxValue}>
      {children}
    </MainStoreContext.Provider>
  );
}
