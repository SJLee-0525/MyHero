import { useState, useContext, createContext } from "react";

import { UserProgressContext } from "./userProgressStore";

export const MessageContext = createContext({
  messageLog: [],
  setMessageLog: () => {},
  handleSendMessage: (role, date, message) => {},
});

// 임시 키로 사용할 id
let id = 0;

export default function MessageContextProvider({ children }) {
  const userProgressStore = useContext(UserProgressContext);

  const [messageLog, setMessageLog] = useState([]);

  function handleSendMessage({ role, date, message }) {
    setMessageLog((prevLog) => {
      const newMessage = { id: ++id, role, date, message };
      console.log(newMessage);
      return [...prevLog, newMessage];
    });
  }

  const ctxValue = {
    messageLog,
    setMessageLog,
    handleSendMessage,
  };

  return (
    <MessageContext.Provider value={ctxValue}>
      {children}
    </MessageContext.Provider>
  );
}
