import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import UserProgressContextProvider from "./store/userProgressStore.jsx";
import EmergencyContextProvider from "./store/emergencyStore.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProgressContextProvider>
      <EmergencyContextProvider>
        <App />
      </EmergencyContextProvider>
    </UserProgressContextProvider>
  </StrictMode>
);
