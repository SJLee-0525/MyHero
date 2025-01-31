import "./Notification.css"

import { useContext } from "react"

import { EmergencyContext } from "../../../store/emergencyStore"

export default function PublicEmergencyNotifications() {
  const emergencyStore = useContext(EmergencyContext)

  // {
  //     SN: 205163,
  //     CRT_DT: "2023/09/16 11:09:49",
  //     MSG_CN: "[행정안전부] 오늘 11시10분 부산 호우경보 산사태ㆍ상습침수 등 위험지역 대피 외출자제 등 안전에 주의바랍니다",
  //     RCPTN_RGN_NM: "부산광역시 전체",
  //     EMRG_STEP_NM: "안전안내",
  //     DST_SE_NM: "호우",
  //     REG_YMD: "2023-09-16",
  //     MDFCN_TMD: "2023-09-16",
  //   },
  return (
    <div id="public-emergency-notifications">
      {emergencyStore.publicEmergencyAlert.map((notification) => {
        return (
          <div className="public-emergency-notification" key={notification.SN}>
            <div className="public-emergency-notification-header">
              <h2>{notification.DST_SE_NM}</h2>
              <p>{notification.EMRG_STEP_NM}</p>
            </div>
            <div className="public-emergency-notification-content">
              <div className="public-emergency-notification-description">{notification.MSG_CN}</div>
            </div>
            <div className="public-emergency-notification-footer">
              <p className="public-emergency-notification-loc">{notification.RCPTN_RGN_NM}</p>
              <p className="public-emergency-notification-date">{notification.CRT_DT}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
