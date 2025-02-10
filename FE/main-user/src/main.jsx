import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadEnvironments } from "./store/environmentsStore.jsx";
import "./index.css";
import App from "./App.jsx";

import UserProgressContextProvider from "./store/userProgressStore.jsx";
import StoreContextProvider from "./store/store.jsx";
import EnvironmentDataContextProvider from "./store/environmentData.jsx";

const startApp = async () => {
  await loadEnvironments();

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <StoreContextProvider>
        <UserProgressContextProvider> 
          <EnvironmentDataContextProvider>
            <App />
          </EnvironmentDataContextProvider>
        </UserProgressContextProvider>
      </StoreContextProvider>
    </StrictMode>
  );
};

startApp();