import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import MainStoreContextProvider from "./store/mainStore.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainStoreContextProvider>
      <App />
    </MainStoreContextProvider>
  </StrictMode>
);
