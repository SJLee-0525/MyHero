import { useState, createContext } from "react";

export const StoreContext = createContext({
  openNewsState: "",
  openMessageState: "",
  openEmergencyState: "",
  openNotificationState: "",
  openCalendarState: "",
  openSettingState: "",
  setOpenNewsState: () => {},
  setOpenMessageState: () => {},
  setOpenEmergencyState: () => {},
  setOpenNotificationState: () => {},
  setOpenCalendarState: () => {},
  setOpenSettingState: () => {},
  handleNewsState: () => {},
  handleMessageState: () => {},
  handleMessageChange: () => {},
  handleSendMessage: () => {},
  handleEmergencyState: () => {},
  handleNotificationState: () => {},
  handleCalendarState: () => {},
  handleModalClose: () => {},
});

export default function StoreContextProvider({ children }) {
  const [openMessageState, setOpenMessageState] = useState(false);
  const [openEmergencyState, setOpenEmergencyState] = useState(false);
  const [openNotificationState, setOpenNotificationState] = useState(false);
  const [openNewsState, setOpenNewsState] = useState(false);
  const [openCalendarState, setOpenCalendarState] = useState(false);
  const [openSettingState, setOpenSettingState] = useState(false);

  function handleMessageState() {
    setOpenMessageState(true);
    console.log("Message: ", !openMessageState);
  }

  function handleMessageChange() {
    setOpenMessageState(true);
    console.log("Message Change: ", !openMessageState);
  }

  function handleSendMessage() {
    setOpenMessageState(true);
    console.log("Send Message: ", !openMessageState);
  }

  function handleEmergencyState() {
    setOpenEmergencyState(true);
    console.log("Emergency: ", !openEmergencyState);
  }

  function handleNewsState() {
    setOpenNewsState(true);
    console.log("News: ", !openNewsState);
  }

  function handleNotificationState() {
    setOpenNotificationState(true);
    console.log("Notification: ", !openNotificationState);
  }

  function handleCalendarState() {
    setOpenCalendarState(true);
    console.log("Calendar: ", !openCalendarState);
  }

  function handleSettingState() {
    setOpenSettingState(true);
    console.log("Setting: ", !openSettingState);
  }

  function handleModalClose() {
    setOpenMessageState(false);
    setOpenEmergencyState(false);
    setOpenNotificationState(false);
    setOpenNewsState(false);
    setOpenCalendarState(false);
    setOpenSettingState(false);
  }

  const ctxValue = {
    openMessageState,
    openEmergencyState,
    openNotificationState,
    openNewsState,
    openCalendarState,
    openSettingState,
    setOpenMessageState,
    setOpenEmergencyState,
    setOpenNotificationState,
    setOpenNewsState,
    setOpenCalendarState,
    setOpenSettingState,
    handleMessageState,
    handleMessageChange,
    handleSendMessage,
    handleEmergencyState,
    handleNotificationState,
    handleNewsState,
    handleCalendarState,
    handleSettingState,
    handleModalClose,
  };

  return (
    <StoreContext.Provider value={ctxValue}>{children}</StoreContext.Provider>
  );
}
