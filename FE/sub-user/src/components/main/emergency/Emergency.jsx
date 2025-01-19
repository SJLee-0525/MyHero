import "./Emergency.css"

import { useState } from "react"

import PageContainer from "../container/PageContainer.jsx"
import EmergencyAlert from "./EmergencyAlert.jsx"

export default function Emergency() {
  const [emergencyAlerts, setEmergencyAlerts] = useState([
    {
      id: 1,
      location: "거실",
      type: "낙상",
      response: false,
      date: "2025/01/20 11:12:51",
      check: false,
    },
    {
      id: 2,
      location: "거실",
      type: "낙상",
      response: true,
      date: "2025/01/20 11:16:51",
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

  console.log(emergencyAlerts)
  return (
    <PageContainer title="긴급 상황 알림">
      <div id="emergency-alert">
        {/* check가 false인 알림을 찾으면 그 알림을 출력하고 중단. some이나 every는 boolean값을 반환하기에 이 목적으로 사용하기 적합하지 않음.. */}
        {(() => {
          const firstUncheckedAlert = emergencyAlerts.find((alert) => !alert.check)
          return firstUncheckedAlert ? <EmergencyAlert key={firstUncheckedAlert.id} emergencyAlert={firstUncheckedAlert} onCheckAlert={handleCheckAlert} /> : <h3>감지된 이상이 없습니다.</h3>
        })()}
      </div>
    </PageContainer>
  )
}
