import { useState, createContext } from "react"

export const MainStoreContext = createContext({
  isActiveSideBarElem: "",
  toggleStatus: {},
  sidebarIsOpened: false,
  setIsActiveSideBarElem: () => {},
  setToggleStatus: () => {},
  setSidebarIsOpened: () => {},
  handleActiveSideBarElem: () => {},
  handleToggleStatus: () => {},
  handleSidebarToggle: () => {},
})

export default function MainStoreContextProvider({ children }) {
  const [isActiveSideBarElem, setIsActiveSideBarElem] = useState(undefined)

  const [toggleStatus, setToggleStatus] = useState({
    notification: false,
    camera: true,
    microphone: true,
    car: false,
  })

  const [sidebarIsOpened, setSidebarIsOpened] = useState(false)

  function handleActiveSideBarElem(identifier) {
    setIsActiveSideBarElem(identifier)
    setSidebarIsOpened(false)
  }

  function handleToggleStatus(toggle) {
    setToggleStatus((prevStatus) => {
      return { ...prevStatus, [toggle]: !prevStatus[toggle] }
    })
  }

  function handleSidebarToggle() {
    setSidebarIsOpened((prev) => !prev)
  }

  const ctxValue = {
    isActiveSideBarElem,
    toggleStatus,
    sidebarIsOpened,
    setIsActiveSideBarElem,
    setToggleStatus,
    setSidebarIsOpened,
    handleActiveSideBarElem,
    handleToggleStatus,
    handleSidebarToggle,
  }

  return <MainStoreContext.Provider value={ctxValue}>{children}</MainStoreContext.Provider>
}
