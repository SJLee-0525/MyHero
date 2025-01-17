import "./App.css";

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopNav from "./components/nav/TopNav";
import SideNav from "./components/nav/SideNav";

import Home from "./components/main/home/Home.jsx";
import Notification from "./components/main/notification/Notification.jsx";
import Message from "./components/main/message/Message.jsx";
import Emergency from "./components/main/emergency/Emergency.jsx";
import Calander from "./components/main/calander/Calander.jsx";
import Activity from "./components/main/activity/Activity.jsx";
import Health from "./components/main/health/Health.jsx";
import Mind from "./components/main/mind/Mind.jsx";

import Accounts from "./components/main/accounts/Accounts.jsx";
import Settings from "./components/main/settings/Settings.jsx";
// import Router from "./router/router";

function App() {
  return (
    <BrowserRouter>
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
            <Route path="/calander" element={<Calander />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/health" element={<Health />} />
            <Route path="/mind" element={<Mind />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
