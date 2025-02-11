import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadEnvironments } from "./store/environmentsStore.jsx";
import { loadNews } from "./store/newsStore.jsx"
import "./index.css";
import App from "./App.jsx";

import UserProgressContextProvider from "./store/userProgressStore.jsx";
import StoreContextProvider from "./store/store.jsx";
import EnvironmentDataContextProvider from "./store/environmentData.jsx";
import NewsStoreContextProvider from "./store/newsStore.jsx";

const startApp = async () => {
  await loadEnvironments();
  await loadNews();

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <StoreContextProvider>
        <UserProgressContextProvider> 
          <EnvironmentDataContextProvider>
            <NewsStoreContextProvider>
              <App />
            </NewsStoreContextProvider>
          </EnvironmentDataContextProvider>
        </UserProgressContextProvider>
      </StoreContextProvider>
    </StrictMode>
  );
};

startApp();