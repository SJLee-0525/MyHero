import { useState, createContext } from "react";

export const StoreContext = createContext({
  openMessageState: "",
  openEmergencyState: "",
  openNotificationState: "",
  openHealthState: "",
  openSettingState: "",
  alertState: "",
  cameraState: "",
  driveState: "",
  micState: "",
  setOpenMessageState: () => {},
  setOpenEmergencyState: () => {},
  setOpenNotificationState: () => {},
  setOpenHealthState: () => {},
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
  handleHealthState: () => {},
  handleModalClose: () => {},
});

export default function StoreContextProvider({ children }) {
  const [openMessageState, setOpenMessageState] = useState(false);
  const [openEmergencyState, setOpenEmergencyState] = useState(false);
  const [openNotificationState, setOpenNotificationState] = useState(false);
  const [openHealthState, setOpenHealthState] = useState(false);
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

  function handleHealthState() {
    setOpenHealthState(true);
    console.log("Health: ", !openHealthState);
  }

  function handleSettingState() {
    setOpenSettingState(true);
    console.log("Setting: ", !openSettingState);
  }

  function handleModalClose() {
    setOpenMessageState(false);
    setOpenEmergencyState(false);
    setOpenNotificationState(false);
    setOpenHealthState(false);
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
    openHealthState,
    openSettingState,
    alertState,
    cameraState,
    driveState,
    micState,
    setOpenMessageState,
    setOpenEmergencyState,
    setOpenNotificationState,
    setOpenHealthState,
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
    handleHealthState,
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
