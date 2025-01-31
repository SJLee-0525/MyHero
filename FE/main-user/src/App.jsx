import React, { useState, useEffect } from "react";
import "./App.css";

import ModalPage from "./components/modal/ModalPage.jsx";
import NavBar from "./components/nav/NavBar.jsx";
import Home from "./components/home/Home.jsx";

import screenProtector from "./assets/screen-protector.png";

function ScreenSaver({ onDismiss }) {
  return (
    <div className="screensaver-container">
      <img
        src={screenProtector}
        alt="screenprotector"
        className="screen-protector"
      />
    </div>
  );
}

export default function App() {
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);

  const SCREENSAVER_TIMEOUT = 500000000000;
  let timeoutId = null;

  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setIsScreensaverActive(true);
    }, SCREENSAVER_TIMEOUT);
  };

  useEffect(() => {
    const savedBackground = localStorage.getItem("background");
    if (savedBackground) {
      document.body.style.background = `url(${savedBackground})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }

    const handleUserActivity = () => {
      if (isScreensaverActive) {
        setIsScreensaverActive(false);
      }
      resetTimer();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, [isScreensaverActive]);

  return (
    <>
      {isScreensaverActive && (
        <ScreenSaver onDismiss={() => setIsScreensaverActive(false)} />
      )}
      <ModalPage />
      <main>
        <NavBar />
        <Home />
      </main>
    </>
  );
}
