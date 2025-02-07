import { useState, createContext } from "react";

export const StoreContext = createContext({
  openMessageState: "",
  openEmergencyState: "",
  openNotificationState: "",
  openCalendarState: "",
  openSettingState: "",
  alertState: "",
  cameraState: "",
  driveState: "",
  micState: "",
  setOpenMessageState: () => {},
  setOpenEmergencyState: () => {},
  setOpenNotificationState: () => {},
  setOpenCalendarState: () => {},
  setOpenSettingState: () => {},
  setAlertState: () => {},
  setCameraState: () => {},
  setDriveState: () => {},
  setMicState: () => {},
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
  const [openCalendarState, setOpenCalendarState] = useState(false);
  const [openSettingState, setOpenSettingState] = useState(false);

  const [alertState, setAlertState] = useState(true);
  const [cameraState, setCameraState] = useState(true);
  const [driveState, setDriveState] = useState(true);
  const [micState, setMicState] = useState(true);

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
    setOpenCalendarState(false);
    setOpenSettingState(false);
  }

  function handleAlertState() {
    setAlertState((prevState) => {
      return !prevState;
    });
    console.log("Alert: ", !alertState);
  }

  function handleCameraState() {
    setCameraState((prevState) => {
      return !prevState;
    });
    console.log("Camera: ", !cameraState);
  }

  function handleDriveState() {
    setDriveState((prevState) => {
      return !prevState;
    });
    console.log("Drive: ", !driveState);
  }

  function handleMicState() {
    setMicState((prevState) => {
      return !prevState;
    });
    console.log("Microphone: ", !micState);
  }

  const ctxValue = {
    openMessageState,
    openEmergencyState,
    openNotificationState,
    openCalendarState,
    openSettingState,
    alertState,
    cameraState,
    driveState,
    micState,
    setOpenMessageState,
    setOpenEmergencyState,
    setOpenNotificationState,
    setOpenCalendarState,
    setOpenSettingState,
    setAlertState,
    setCameraState,
    setDriveState,
    setMicState,
    handleMessageState,
    handleMessageChange,
    handleSendMessage,
    handleEmergencyState,
    handleNotificationState,
    handleCalendarState,
    handleSettingState,
    handleModalClose,
    handleAlertState,
    handleCameraState,
    handleDriveState,
    handleMicState,
  };

  return (
    <StoreContext.Provider value={ctxValue}>{children}</StoreContext.Provider>
  );
}
