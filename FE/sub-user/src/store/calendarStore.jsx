import { useState, createContext, useEffect } from "react"
import useCalendar from "../hooks/useCalendar"
import { set } from "date-fns"

export const CalendarStoreContext = createContext({
  currentDate: {
    year: "",
    month: "",
    day: "",
  },
  daysInMonth: {
    date: "",
    year: "",
    month: "",
    day: "",
    dayIndexOfWeek: 1,
  },
  dispatch: {
    handlePrevYear: () => {},
    handleNextYear: () => {},
    handlePrevMonth: () => {},
    handleNextMonth: () => {},
  },
  selectedDate: {
    date: "",
    selectedDate: () => {},
  },
  groupDataByKST: (data) => {},
  groupDataByKSTWithAvgScore: (identifier, data) => {},
  schedules: {
    schedules: [],
    addSchedule: () => {},
  },
})

export default function CalendarStoreContextProvider({ children }) {
  const context = useCalendar()

  function groupDataByKST(data) {
    const groupedData = {}

    data.forEach((item) => {
      // UTC -> KST 변환 (UTC+9)
      const kstDate = new Date(item.reported_at)
      kstDate.setHours(kstDate.getHours() + 9)

      // YYYY-MM-DD 형식으로 변환
      const dateKey = kstDate.toISOString().split("T")[0]

      // 날짜별 데이터 저장
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = []
      }
      groupedData[dateKey].push({
        ...item,
        reported_at: kstDate.toISOString(), // KST 변환된 시간 저장
      })
    })

    return groupedData
  }

  function groupDataByKSTWithAvgScore(identifier, data) {
    const groupedData = {}

    if (!data || Object.keys(data).length === 0) {
      setSchedules((prevSchedules) => {
        return {
          ...prevSchedules,
          [identifier]: {},
        }
      })

      return {}
    }

    data.forEach((item) => {
      // UTC -> KST 변환 (UTC+9)
      const kstDate = new Date(item.reported_at)
      kstDate.setHours(kstDate.getHours() + 9)

      // YYYY-MM-DD 형식으로 변환
      const dateKey = kstDate.toISOString().split("T")[0]

      // 날짜별 데이터 저장 및 점수 합산
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { records: [], totalScore: 0, count: 0 }
      }

      groupedData[dateKey].records.push({
        ...item,
        reported_at: kstDate.toISOString(), // KST 변환된 시간 저장
      })

      // 점수 합산 및 개수 증가
      groupedData[dateKey].totalScore += item.score
      groupedData[dateKey].count += 1
    })

    // 평균 점수 계산
    const result = {}
    Object.keys(groupedData).forEach((date) => {
      const { records, totalScore, count } = groupedData[date]
      result[date] = {
        records,
        averageScore: count > 0 ? totalScore / count : 0, // 평균 점수 계산
      }
    })

    setSchedules((prevSchedules) => {
      return {
        ...prevSchedules,
        [identifier]: result,
      }
    })

    return result
  }

  // 상태 관리
  const [schedules, setSchedules] = useState({ mental: {}, health: {} })

  // 상태 변경 시 localStorage에 저장
  // useEffect(() => {
  //   localStorage.setItem("schedules", JSON.stringify(schedules))
  // }, [schedules])

  // 스케줄 추가 함수
  const addSchedule = (date, schedule) => {
    setSchedules((prevSchedules) => {
      const updatedSchedules = {
        ...prevSchedules,
        [date]: prevSchedules[date] ? [...prevSchedules[date], schedule] : [schedule],
      }
      return updatedSchedules
    })
  }

  const ctxValue = {
    ...context,
    groupDataByKST,
    groupDataByKSTWithAvgScore,
    schedules: {
      schedules,
      addSchedule,
    },
  }

  // console.log(ctxValue)
  return <CalendarStoreContext.Provider value={ctxValue}>{children}</CalendarStoreContext.Provider>
}
