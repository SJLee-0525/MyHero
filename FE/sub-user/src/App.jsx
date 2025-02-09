import "./App.css"

import { useEffect, useContext } from "react"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import { UserProgressContext } from "./store/userProgressStore.jsx"
import { HomeStatusContext } from "./store/homeStatusStore.jsx"
import { HealthContext } from "./store/healthStore.jsx"
import { CalendarStoreContext } from "./store/calendarStore.jsx"

import TopNav from "./components/nav/TopNav"
import SideNav from "./components/nav/SideNav"
import LoadingSpinner from "./components/spinner/LoadingSpinner.jsx"

import Home from "./components/main/home/Home.jsx"
import Notification from "./components/main/notification/Notification.jsx"
import Message from "./components/main/message/Message.jsx"
import Emergency from "./components/main/emergency/Emergency.jsx"
import Calendar from "./components/main/calendar/Calendar.jsx"
import Activity from "./components/main/activity/Activity.jsx"
import Mental from "./components/main/mental/Mental.jsx"

import Accounts from "./components/main/accounts/Accounts.jsx"
import Settings from "./components/main/settings/Settings.jsx"
// import Router from "./router/router";

import Advertisement from "./components/main/advertisement/Advertisement.jsx"
import { use } from "react"

function App() {
  const userProgressStore = useContext(UserProgressContext)
  const homeStatusStore = useContext(HomeStatusContext)
  const healthStore = useContext(HealthContext)
  const calendarStore = useContext(CalendarStoreContext)

  const loading = userProgressStore.loading || homeStatusStore.loading || healthStore.loading

  // 페이지 로드 시 로그인 상태 확인 후 활성화된 사이드 바 상태 가져오기
  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("loginUserInfo")

    const storedActiveSideBarElem = sessionStorage.getItem("isActiveSideBarElem")
    if (!storedUserInfo) return

    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo)

        userProgressStore.setLoginUserInfo({
          login: true,
          userInfo: parsedUserInfo.userInfo,
        })

        // 사용자 정보 최신화
        userProgressStore.handleGetUserInfo(parsedUserInfo.userInfo.id)
      } catch (error) {
        console.error("Error parsing loginUserInfo from sessionStorage:", error)
        sessionStorage.removeItem("loginUserInfo") // 손상된 데이터 제거
      }
    }

    try {
      if (storedActiveSideBarElem) {
        userProgressStore.setIsActiveSideBarElem(storedActiveSideBarElem)
      }
    } catch (error) {
      console.error("Error parsing isActiveSideBarElem from sessionStorage:", error)
      sessionStorage.removeItem("isActiveSideBarElem") // 데이터 손상 시 제거
    }
  }, [])

  // loginUserInfo가 업데이트된 후에 handleCheckFamilyList 호출
  // loginUserInfo가 상태로 관리되고 있다면, setLoginUserInfo 함수가 비동기적으로 실행되기 때문에 바로 loginUserInfo.userInfo.id에 접근할 때 값이 갱신되지 않았을 수 있습니다.
  // 이는 React의 상태 관리 특성 때문에 발생하는 문제로, 상태가 비동기적으로 업데이트되기 때문에 바로 loginUserInfo 값을 사용할 수 없습니다.
  useEffect(() => {
    const fetchData = async () => {
      if (!userProgressStore.loginUserInfo.login) {
        return
      } else if (userProgressStore.loginUserInfo.login && userProgressStore.loginUserInfo.userInfo.id) {
        if (userProgressStore.loginUserInfo.userInfo.role === "main") {
          await userProgressStore.handleCheckFamilyExist(userProgressStore.loginUserInfo.userInfo.id)
        } else if (userProgressStore.loginUserInfo.userInfo.role === "sub") {
          await userProgressStore.handleCheckFamilyList()
        }
      }
    }

    fetchData()
  }, [userProgressStore.loginUserInfo.userInfo])

  useEffect(() => {
    if (!userProgressStore.loginUserInfo.login) {
      return
    }

    const fetchData = async () => {
      console.log("🔄 useEffect 내부 실행됨!", {
        member: userProgressStore.memberInfo,
        family: userProgressStore.familyInfo,
        login: userProgressStore.loginUserInfo,
      })

      if (userProgressStore.memberInfo.selectedFamilyId || userProgressStore.familyInfo.familyInfo.id) {
        console.log("📡 API 요청 시작!", {
          member: userProgressStore.memberInfo,
          family: userProgressStore.familyInfo,
          login: userProgressStore.loginUserInfo,
        })
        await homeStatusStore.handleGetLatestHomeStatus()
        await healthStore.handleGetHealthData()
        await healthStore.handleGetActivityStatus()
        await healthStore.handleGetMentalStatus()
        await healthStore.handleGetMentalReports()
        await healthStore.handleGetWeekData()
        console.log("📡 API 요청 끝!")
      }
    }

    fetchData()
  }, [userProgressStore.memberInfo.selectedFamilyId, userProgressStore.familyInfo.familyInfo?.id])

  useEffect(() => {
    if (!userProgressStore.loginUserInfo.login) {
      return
    }

    const fetchData = async () => {
      if (healthStore.activityStatus.length > 0) {
        await calendarStore.groupDataByKSTWithAvgScore("health", healthStore.activityStatus)
      } else {
        await calendarStore.groupDataByKSTWithAvgScore("health", {})
      }

      if (healthStore.mentalStatus.length > 0) {
        await calendarStore.groupDataByKSTWithAvgScore("mental", healthStore.mentalStatus)
      } else {
        await calendarStore.groupDataByKSTWithAvgScore("mental", {})
      }
    }

    fetchData()
  }, [healthStore.activityStatus, healthStore.mentalStatus])

  return (
    <BrowserRouter>
      {loading && <LoadingSpinner />}
      {userProgressStore.loginUserInfo.login ? (
        <div id="app">
          <nav id="top-nav">
            <TopNav />
          </nav>
          <nav id="side-nav">
            <SideNav />
          </nav>

          <main id="main-page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/message" element={<Message />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/mental" element={<Mental />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      ) : (
        <div id="app">
          <Advertisement />
        </div>
      )}
    </BrowserRouter>
  )
}

export default App
