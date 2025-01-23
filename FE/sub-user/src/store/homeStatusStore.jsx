import { useState, useContext, createContext } from "react";

import { UserProgressContext } from "./userProgressStore";

export const HomeStatusContext = createContext({
  homeStatus: {
    data: {
      temperature: 25,
      humidity: 40,
      dust_level: 26,
      ethanol: 12,
      others: null,
    },
  },
  setHomeStatus: () => {},
});

export default function HomeStatusContextProvider({ children }) {
  const userProgressStore = useContext(UserProgressContext);

  const [homeStatus, setHomeStatus] = useState({
    data: {
      temperature: 25,
      humidity: 40,
      dust_level: 26,
      ethanol: 12,
      others: null,
    },
  });

  const ctxValue = {
    homeStatus,
    setHomeStatus,
  };

  return (
    <createContext.Provider value={ctxValue}>{children}</createContext.Provider>
  );
}
