import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadEnvironments } from "./store/environmentsStore.jsx";
import "./index.css";
import App from "./App.jsx";

import UserProgressContextProvider from "./store/userProgressStore.jsx";
import StoreContextProvider from "./store/store.jsx";
import EnvironmentDataContextProvider from "./store/environmentData.jsx";
import WeatherStoreContextProvider from "./store/weatherStore.jsx";
import NewsStoreContextProvider from "./store/newsStore.jsx";

const startApp = async () => {
  await loadEnvironments();

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <StoreContextProvider>
        <UserProgressContextProvider> 
          <EnvironmentDataContextProvider>
            <WeatherStoreContextProvider>
              <NewsStoreContextProvider>
                <App />
              </NewsStoreContextProvider>
            </WeatherStoreContextProvider>  
          </EnvironmentDataContextProvider>
        </UserProgressContextProvider>
      </StoreContextProvider>
    </StrictMode>
  );
};

startApp();