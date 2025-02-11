import "./App.css";

import { useEffect, useContext } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { UserProgressContext } from "./store/userProgressStore.jsx";
import { HomeStatusContext } from "./store/homeStatusStore.jsx";
import { HealthContext } from "./store/healthStore.jsx";
import { EmergencyContext } from "./store/emergencyStore.jsx";
import { CalendarStoreContext } from "./store/calendarStore.jsx";

import TopNav from "./components/nav/TopNav";
import SideNav from "./components/nav/SideNav";
import LoadingSpinner from "./components/spinner/LoadingSpinner.jsx";

import Home from "./components/main/home/Home.jsx";
import Notification from "./components/main/notification/Notification.jsx";
import Message from "./components/main/message/Message.jsx";
import Emergency from "./components/main/emergency/Emergency.jsx";
import Calendar from "./components/main/calendar/Calendar.jsx";
import Activity from "./components/main/activity/Activity.jsx";
import Mental from "./components/main/mental/Mental.jsx";

import Accounts from "./components/main/accounts/Accounts.jsx";
import Settings from "./components/main/settings/Settings.jsx";
import RegisterMemberQr from "./components/main/accounts/RegisterMemberQr.jsx";
// import Router from "./router/router";

import Advertisement from "./components/main/advertisement/Advertisement.jsx";

function App() {
  const userProgressStore = useContext(UserProgressContext);
  const homeStatusStore = useContext(HomeStatusContext);
  const healthStore = useContext(HealthContext);
  const emergencyStore = useContext(EmergencyContext);
  const calendarStore = useContext(CalendarStoreContext);

  const loading =
    userProgressStore.loading ||
    homeStatusStore.loading ||
    healthStore.loading ||
    emergencyStore.loading;

  return (
    <BrowserRouter>
      {loading && <LoadingSpinner />}
      <div id="app">
        {userProgressStore.loginUserInfo.login && (
          <>
            <nav id="top-nav">
              <TopNav />
            </nav>
            <nav id="side-nav">
              <SideNav />
            </nav>
          </>
        )}
        <main id="main-page">
          <Routes>
            {/* 로그인 여부와 상관없는 공용 라우트 */}
            <Route
              path="/accounts/register/:familyId"
              element={<RegisterMemberQr />}
            />
            {/* 로그인 여부에 따라 다른 화면 표시 */}
            {userProgressStore.loginUserInfo.login ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/message" element={<Message />} />
                {/* <Route path="/emergency" element={<Emergency />} /> */}
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/mental" element={<Mental />} />
                <Route path="/accounts/*" element={<Accounts />} />
                <Route path="/settings" element={<Settings />} />
              </>
            ) : (
              <Route path="/" element={<Advertisement />} />
            )}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
