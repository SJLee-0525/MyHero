export default function Notification() {
  const emergencyAlerts = [
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
  ]

  return (
    <div>
      <h3>This is Notification</h3>
    </div>
  )
}
