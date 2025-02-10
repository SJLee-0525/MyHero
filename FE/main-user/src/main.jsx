import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import UserProgressContextProvider from "./store/userProgressStore.jsx";
import StoreContextProvider from "./store/store.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StoreContextProvider>
      <UserProgressContextProvider> 
        <App />
      </UserProgressContextProvider>
    </StoreContextProvider>
  </StrictMode>
);
