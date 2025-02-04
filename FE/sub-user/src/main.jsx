import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import UserProgressContextProvider from "./store/userProgressStore.jsx";
// import HomeStatusContextProvider from "./store/homeStatusStore.jsx";
import EmergencyContextProvider from "./store/emergencyStore.jsx";
import CalendarStoreContextProvider from "./store/calendarStore.jsx";
import MessageContextProvider from "./store/messageStore.jsx";
import HealthContextProvider from "./store/healthStore.jsx";

import { loadEnvironments } from "./store/environmentsStore.jsx";

const startApp = async () => {
  await loadEnvironments();

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <UserProgressContextProvider>
        <HealthContextProvider>
          <HealthContextProvider>
            <EmergencyContextProvider>
              <MessageContextProvider>
                <CalendarStoreContextProvider>
                  <App />
                </CalendarStoreContextProvider>
              </MessageContextProvider>
            </EmergencyContextProvider>
          </HealthContextProvider>
        </HealthContextProvider>
      </UserProgressContextProvider>
    </StrictMode>
  );
};

startApp();
