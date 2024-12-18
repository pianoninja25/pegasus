"use client";

import { createContext, useContext } from "react";

const SessionContext = createContext();

export const useSessionContext = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ session, children }) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
