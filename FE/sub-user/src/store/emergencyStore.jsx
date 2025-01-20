import { useState, useContext, createContext } from "react";

import { UserProgressContext } from "./userProgressStore";

export const EmergencyContext = createContext({
  emergencyAlerts: [
    {
      id: 1,
      location: "",
      type: "",
      response: false,
      date: "",
      check: false,
      imgSrc: "",
    },
  ],
  setEmergencyAlerts: () => {},
  handleCheckAlert: () => {},
  handleShowAlertLog: () => {},
});

export default function EmergencyContextProvider({ children }) {
  const userProgressStore = useContext(UserProgressContext);

  const [emergencyAlerts, setEmergencyAlerts] = useState([
    {
      id: 1,
      location: "거실",
      type: "낙상",
      response: false,
      date: "2025/01/20 11:12:51",
      check: false,
      imgSrc: "/lim.png",
    },
    {
      id: 2,
      location: "거실",
      type: "낙상",
      response: true,
      date: "2025/01/20 11:16:51",
      check: false,
      imgSrc: "/lim.png",
    },
    {
      id: 3,
      location: "거실",
      type: "낙상",
      response: false,
      date: "2025/01/20 11:12:51",
      check: true,
      imgSrc: "/lim.png",
    },
    {
      id: 4,
      location: "거실",
      type: "낙상",
      response: true,
      date: "2025/01/20 11:16:51",
      check: true,
      imgSrc: "/lim.png",
    },
    {
      id: 5,
      location: "거실",
      type: "낙상",
      response: false,
      date: "2025/01/20 11:12:51",
      check: true,
      imgSrc: "/lim.png",
    },
    {
      id: 6,
      location: "거실",
      type: "낙상",
      response: true,
      date: "2025/01/20 11:16:51",
      check: true,
      imgSrc: "/lim.png",
    },
  ]);

  // 한 번 확인하면 이전의 알림은 전부 읽음 처리.
  function handleCheckAlert() {
    return setEmergencyAlerts((prevAlerts) => {
      return prevAlerts.map((prevAlert) => {
        return {
          ...prevAlert,
          check: true,
        };
      });
    });
  }

  function handleShowAlertLog() {
    userProgressStore.handleOpenModal("emergency-alert-log");
  }

  console.log(emergencyAlerts);

  const ctxValue = {
    emergencyAlerts,
    setEmergencyAlerts,
    handleCheckAlert,
    handleShowAlertLog,
  };

  return (
    <EmergencyContext.Provider value={ctxValue}>
      {children}
    </EmergencyContext.Provider>
  );
}
