import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import UserProgressContextProvider from "./store/userProgressStore.jsx";
import EmergencyContextProvider from "./store/emergencyStore.jsx";
import CalendarStoreContextProvider from "./store/calendarStore.jsx";
import MessageContextProvider from "./store/messageStore.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProgressContextProvider>
      <EmergencyContextProvider>
        <MessageContextProvider>
          <CalendarStoreContextProvider>
            <App />
          </CalendarStoreContextProvider>
        </MessageContextProvider>
      </EmergencyContextProvider>
    </UserProgressContextProvider>
  </StrictMode>
);
