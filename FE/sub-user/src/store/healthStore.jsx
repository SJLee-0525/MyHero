import { useState, useContext, createContext } from "react"
import { useHttp } from "../hooks/useHttp"

import { UserProgressContext } from "./userProgressStore"

export const HealthContext = createContext({
  healthStatus: [
    {
      index: 1,
      family_id: "",
      reported_at: "",
      heart_rate: 1,
    },
  ],
  activityStatus: [
    {
      index: 1,
      family_id: "",
      reported_at: "",
      score: 0,
      action: "",
      is_critical: false,
      description: { title: "", data: 123.456 },
    },
  ],
  mentalStatus: [
    {
      index: 1,
      family_id: "",
      reported_at: "",
      score: 5,
      is_critical: false,
      description: {
        overall_emotional_state: "",
        emotional_insights: "",
        time_based_emotions: {},
        recommendations: [],
      },
    },
  ],
  mentalReport: [
    {
      index: 3,
      family_id: "FlcuDLxVC9SolW70",
      reported_at: "2025-02-07T00:31:04",
      start_time: "2025-02-01T00:30:24",
      end_time: "2025-02-06T23:59:59",
      average_score: 90,
      critical_days: 2,
      best_day: "2025-02-03",
      worst_day: "2025-02-05",
      improvement_needed: false,
      summary: "또 다른 총평 요약",
    },
  ],
  weeklyData: [{ name: "", value: 0 }],
  keywords: [],
  keywordColors: [],
  healthLog: {
    data: [
      {
        date: "",
        health: 1,
        mental: 1,
      },
    ],
    mentalReport: {
      data: [
        {
          id: 3,
          user_id: "",
          created_at: "",
          report_content: {
            overall_emotional_state: "",
            emotional_insights: "",
            time_based_emotions: {},
            recommendations: [],
          },
        },
      ],
    },
  },
  handleShowDetailReport: () => {},
  handleGetHealthData: () => {},
  handleGetActivityStatus: () => {},
  handleGetMentalStatus: () => {},
  handleGetMentalReports: () => {},
})

export default function HealthContextProvider({ children }) {
  const userProgressStore = useContext(UserProgressContext)

  const { request, loading } = useHttp()

  const [healthStatus, setHealthStatus] = useState([])
  const [activityStatus, setActivityStatus] = useState([])
  const [mentalStatus, setMentalStatus] = useState([])
  const [mentalReport, setMentalReport] = useState([])

  const [weeklyData, setWeeklyData] = useState([
    { name: "health", value: 0 },
    { name: "mental", value: 0 },
  ])

  // 대화 키워드 관련련
  const keywords = ["임영웅", "김치찌개", "두부", "여행", "병원"]
  const keywordColors = [
    ["#146152", "white"],
    ["#44803F", "white"],
    ["#B4CF66", "black"],
    ["#FFEC5C", "black"],
    ["#FF5A33", "white"],
  ]

  // 건강 점수수
  const healthLog = []

  let familyId = ""
  if (userProgressStore.loginUserInfo.userInfo?.role === "sub") {
    familyId = userProgressStore.memberInfo.selectedFamilyId
  } else if (userProgressStore.loginUserInfo.userInfo?.role === "main") {
    familyId = userProgressStore.familyInfo?.familyInfo?.id
  }

  // 상세 보고서 모달 열기
  function handleShowDetailReport() {
    userProgressStore.handleOpenModal("detail-mental-report")
  }

  // 1년 전부터 현재 시간까지의 범위를 UTC 기준으로 출력하는 함수
  function getOneYearRangeUTC() {
    const now = new Date() // 현재 시간 (UTC)
    const oneYearAgo = new Date()
    oneYearAgo.setUTCFullYear(now.getUTCFullYear() - 1) // UTC 기준 1년 전

    const formatUTCDate = (date) => date.toISOString().split(".")[0] + "Z" // 밀리초 제거 후 'Z' 추가

    return {
      start: formatUTCDate(oneYearAgo),
      end: formatUTCDate(now),
    }
  }

  // 7일 전부터 현재 시간까지의 범위를 UTC 기준으로 출력하는 함수
  const getSevenDaysRangeUTC = () => {
    const now = new Date()

    // 7일 전 날짜 계산
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setUTCDate(now.getUTCDate() - 7)

    // 날짜를 ISO 8601 형식으로 변환하고, 밀리초 제거 후 'Z' 추가
    const formatUTCDate = (date) => date.toISOString().split(".")[0] + "Z"

    return {
      start: formatUTCDate(sevenDaysAgo),
      end: formatUTCDate(now),
    }
  }

  async function handleGetHealthData(inputStart = null, inputEnd = null, order = "desc") {
    if (!familyId) {
      console.error("가족 ID가 없습니다.")
      return {
        success: false,
        error: {
          type: "no_family_id",
          message: "가족 ID가 없습니다.",
        },
      }
    }

    const { start, end } = getOneYearRangeUTC()

    if (!inputStart) {
      inputStart = start
    }

    if (!inputEnd) {
      inputEnd = end
    }

    try {
      const response = await request(`${userProgressStore.DEV_API_URL}/status/health/${familyId}?start=${start}&end=${end}&order=${order}`)

      // console.log("handleGetHealthData response", response);
      const resData = response.data

      if (response.success) {
        if (resData.message === "Health status retrieved successfully") {
          setHealthStatus([...resData.data])
          return {
            success: true,
            data: resData.data,
          }
        } else if (resData.message === "No health status found") {
          setHealthStatus([...resData.data])
          return {
            success: true,
            data: resData.data,
          }
        }
      } else {
        console.error("최신 건강 정보 조회 실패:", resData.error)
        setHealthStatus([])
        return {
          success: false,
          error: {
            type: resData.error.type,
            message: resData.error.message,
          },
        }
      }
    } catch (error) {
      console.error(error)
      setHealthStatus([])
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      }
    }
  }

  async function handleGetActivityStatus(inputStart = null, inputEnd = null, order = "desc") {
    if (!familyId) {
      console.error("가족 ID가 없습니다.")
      return {
        success: false,
        error: {
          type: "no_family_id",
          message: "가족 ID가 없습니다.",
        },
      }
    }

    const { start, end } = getOneYearRangeUTC()

    if (!inputStart) {
      inputStart = start
    }

    if (!inputEnd) {
      inputEnd = end
    }

    try {
      const response = await request(`${userProgressStore.DEV_API_URL}/status/active/${familyId}?start=${inputStart}&end=${inputEnd}&order=${order}`)

      // console.log("handleGetActivityStatus response", response);
      const resData = response.data

      if (response.success) {
        if (resData.message === "Active status retrieved successfully") {
          setActivityStatus(
            resData.data.map((item) => ({
              ...item,
              description: JSON.parse(item.description.replace(/'/g, '"')),
            }))
          )
          return {
            success: true,
            data: resData.data,
          }
        } else if (resData.message === "No active status found") {
          setActivityStatus([...resData.data])
          return {
            success: true,
            data: resData.data,
          }
        }
      } else {
        console.error("최신 활동 정보 조회 실패:", resData.error)
        setActivityStatus([])
        return {
          success: false,
          error: {
            type: resData.error.type,
            message: resData.error.message,
          },
        }
      }
    } catch (error) {
      console.error(error)
      setActivityStatus([])
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      }
    }
  }

  async function handleGetMentalStatus(inputStart = null, inputEnd = null, order = "desc") {
    if (!familyId) {
      console.error("가족 ID가 없습니다.")
      return {
        success: false,
        error: {
          type: "no_family_id",
          message: "가족 ID가 없습니다.",
        },
      }
    }

    const { start, end } = getOneYearRangeUTC()

    if (!inputStart) {
      inputStart = start
    }

    if (!inputEnd) {
      inputEnd = end
    }

    try {
      const response = await request(`${userProgressStore.DEV_API_URL}/status/mental/${familyId}?start=${inputStart}&end=${inputEnd}&order=${order}`)

      // console.log("handleGetMentalStatus response", response);
      const resData = response.data

      if (response.success) {
        if (resData.message === "Mental status retrieved successfully") {
          setMentalStatus(
            resData.data.map((item) => ({
              ...item,
              description: JSON.parse(item.description.replace(/'/g, '"')),
            }))
          )
          return {
            success: true,
            data: resData.data,
          }
        } else if (resData.message === "No mental status found") {
          setMentalStatus([...resData.data])
          return {
            success: true,
            data: resData.data,
          }
        }
      } else {
        console.error("최신 정신 정보 조회 실패:", resData.error)
        setMentalStatus([])
        return {
          success: false,
          error: {
            type: resData.error.type,
            message: resData.error.message,
          },
        }
      }
    } catch (error) {
      console.error(error)
      setMentalStatus([])
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      }
    }
  }

  async function handleGetMentalReports(inputStart = null, inputEnd = null, order = "desc") {
    if (!familyId) {
      console.error("가족 ID가 없습니다.")
      return {
        success: false,
        error: {
          type: "no_family_id",
          message: "가족 ID가 없습니다.",
        },
      }
    }

    const { start, end } = getOneYearRangeUTC()

    if (!inputStart) {
      inputStart = start
    }

    if (!inputEnd) {
      inputEnd = end
    }

    try {
      const response = await request(`${userProgressStore.DEV_API_URL}/status/mental-reports/${familyId}?start=${inputStart}&end=${inputEnd}&order=${order}`)

      // console.log("handleGetMentalReports response", response);
      const resData = response.data

      if (response.success) {
        if (resData.message === "Mental reports retrieved successfully") {
          setMentalReport([...resData.data])
          return {
            success: true,
            data: resData.data,
          }
        } else if (resData.message === "No mental reports found") {
          setMentalReport([...resData.data])
          return {
            success: true,
            data: resData.data,
          }
        }
      } else {
        console.error("최신 정신 보고서 조회 실패:", resData.error)
        setMentalReport([])
        return {
          success: false,
          error: {
            type: resData.error.type,
            message: resData.error.message,
          },
        }
      }
    } catch (error) {
      console.error(error)
      setMentalReport([])
      return {
        success: false,
        error: {
          type: "network_error",
          message: "네트워크 오류가 발생했습니다.",
        },
      }
    }
  }

  const handleGetWeekData = async () => {
    if (!userProgressStore.memberInfo.selectedFamilyId) return

    const { start, end } = getSevenDaysRangeUTC()

    try {
      // 첫 번째 API 호출: 활동 상태
      const response = await handleGetActivityStatus(start, end, "desc")

      if (response.success && response.data.length > 0) {
        const health = response.data.reduce((acc, entry) => acc + entry.score, 0) / response.data.length
        // health 값 업데이트
        setWeeklyData((prev) => prev.map((item) => (item.name === "health" ? { ...item, value: health } : item)))
      } else {
        // 데이터가 없을 경우 초기화
        setWeeklyData((prev) => prev.map((item) => (item.name === "health" ? { ...item, value: 0 } : item)))
      }

      // 두 번째 API 호출: 정신 상태
      const secResponse = await handleGetMentalStatus(start, end, "desc")

      if (secResponse.success && secResponse.data.length > 0) {
        const mental = secResponse.data.reduce((acc, entry) => acc + entry.score, 0) / secResponse.data.length

        // mental 값 업데이트
        setWeeklyData((prev) => prev.map((item) => (item.name === "mental" ? { ...item, value: mental } : item)))
      } else {
        // 데이터가 없을 경우 초기화
        setWeeklyData((prev) => prev.map((item) => (item.name === "mental" ? { ...item, value: 0 } : item)))
      }
    } catch (error) {
      console.error("활동 상태 데이터를 불러오는 데 실패했습니다.", error)
    }
  }

  const ctxValue = {
    loading,
    healthStatus,
    activityStatus,
    mentalStatus,
    mentalReport,
    weeklyData,
    keywords,
    keywordColors,
    healthLog,
    handleShowDetailReport,
    handleGetHealthData,
    handleGetActivityStatus,
    handleGetMentalStatus,
    handleGetMentalReports,
    handleGetWeekData,
  }

  return <HealthContext.Provider value={ctxValue}>{children}</HealthContext.Provider>
}
