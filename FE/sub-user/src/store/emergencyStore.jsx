import { useState, useContext, createContext } from "react"

import { UserProgressContext } from "./userProgressStore"

export const EmergencyContext = createContext({
  emergencyAlerts: [
    {
      id: 0,
      location: "",
      type: "",
      response: false,
      date: "",
      check: false,
      imgSrc: "",
    },
  ],
  publicEmergencyAlert: [
    {
      SN: 0,
      CRT_DT: "",
      MSG_CN: "",
      RCPTN_RGN_NM: "",
      EMRG_STEP_NM: "",
      DST_SE_NM: "",
      REG_YMD: "",
      MDFCN_TMD: "",
    },
  ],
  homeNotifications: [
    {
      index: 0,
      family_id: 0,
      notification_grade: 0,
      descriptions: "",
      date: "",
      check: false,
    },
  ],
  setEmergencyAlerts: () => {},
  setPublicEmergencyAlert: () => {},
  setHomeNotifications: () => {},
  handleCheckAlert: () => {},
  handleShowAlertLog: () => {},
  handleCheckHomeAlert: () => {},
})

export default function EmergencyContextProvider({ children }) {
  const userProgressStore = useContext(UserProgressContext)

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
  ])

  const [publicEmergencyAlert, setPublicEmergencyAlert] = useState([
    {
      SN: 205163,
      CRT_DT: "2023/09/16 11:09:49",
      MSG_CN: "[행정안전부] 오늘 11시10분 부산 호우경보 산사태ㆍ상습침수 등 위험지역 대피 외출자제 등 안전에 주의바랍니다",
      RCPTN_RGN_NM: "부산광역시 전체",
      EMRG_STEP_NM: "안전안내",
      DST_SE_NM: "호우",
      REG_YMD: "2023-09-16",
      MDFCN_TMD: "2023-09-16",
    },
    {
      SN: 205265,
      CRT_DT: "2023/09/17 06:05:36",
      MSG_CN: "[기장군] 호우경보 발효중. 하천산책로 해안가 급경사지 등 위험지역 접근금지 및 노약자 외출자제 등 안전에 유의하여 주시기 바랍니다.",
      RCPTN_RGN_NM: "부산광역시 기장군",
      EMRG_STEP_NM: "안전안내",
      DST_SE_NM: "한파",
      REG_YMD: "2023-09-17",
      MDFCN_TMD: "2023-09-17",
    },
  ])

  const [homeNotifications, setHomeNotifications] = useState([
    {
      index: 1,
      family_id: 1,
      notification_grade: 2,
      descriptions: "room1의 온도가 30도를 넘었습니다.",
      date: "2025/01/04 23:24:11",
      check: true,
    },
    {
      index: 2,
      family_id: 1,
      notification_grade: 1,
      descriptions: "어머니로부터 메시지가 도착했습니다.",
      date: "2025/01/09 09:15:11",
      check: true,
    },
    {
      index: 3,
      family_id: 1,
      notification_grade: 3,
      descriptions: "실내에서 가스 누출이 감지되었습니다.",
      date: "2025/01/10 11:25:30",

      check: false,
    },
    {
      index: 4,
      family_id: 1,
      notification_grade: 2,
      descriptions: "비정상적인 움직임이 감지되었습니다.",
      date: "2025/01/10 14:12:51",

      check: false,
    },
  ])

  // 한 번 확인하면 이전의 알림은 전부 읽음 처리.
  function handleCheckAlert() {
    return setEmergencyAlerts((prevAlerts) => {
      return prevAlerts.map((prevAlert) => {
        return {
          ...prevAlert,
          check: true,
        }
      })
    })
  }

  // 긴급 상황 알림 기록 모달 호출
  function handleShowAlertLog() {
    userProgressStore.handleOpenModal("emergency-alert-log")
  }

  function handleCheckHomeAlert() {
    return setHomeNotifications((prevAlerts) => {
      return prevAlerts.map((prevAlert) => {
        return {
          ...prevAlert,
          check: true,
        }
      })
    })
  }

  console.log(emergencyAlerts)

  const ctxValue = {
    emergencyAlerts,
    publicEmergencyAlert,
    homeNotifications,
    setEmergencyAlerts,
    setPublicEmergencyAlert,
    setHomeNotifications,
    handleCheckAlert,
    handleShowAlertLog,
    handleCheckHomeAlert,
  }

  return <EmergencyContext.Provider value={ctxValue}>{children}</EmergencyContext.Provider>
}
