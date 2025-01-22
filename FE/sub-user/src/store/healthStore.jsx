import { useState, useContext, createContext } from "react";

import { UserProgressContext } from "./userProgressStore";

export const HealthContext = createContext({
  healthLog: [
    {
      date: "",
      health: 1,
      mental: 1,
    },
  ],
});

export default function HealthContextProvider({ children }) {
  const userProgressStore = useContext(UserProgressContext);

  const healthLog = [
    {
      date: "01-15",
      health: 57,
      mental: 65,
    },
    {
      date: "01-16",
      health: 72,
      mental: 90,
    },
    {
      date: "01-17",
      health: 85,
      mental: 88,
    },
    {
      date: "01-18",
      health: 68,
      mental: 72,
    },
    {
      date: "01-19",
      health: 72,
      mental: 82,
    },
    {
      date: "01-20",
      health: 59,
      mental: 67,
    },
    {
      date: "01-21",
      health: 69,
      mental: 80,
    },
  ];

  const ctxValue = {
    healthLog,
  };

  return (
    <HealthContext.Provider value={ctxValue}>{children}</HealthContext.Provider>
  );
}
