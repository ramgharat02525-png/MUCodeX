"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ConnectivityContextValue = {
  isOffline: boolean;
  toggle: () => void;
};

const ConnectivityContext = createContext<ConnectivityContextValue>({
  isOffline: false,
  toggle: () => {},
});

export function ConnectivityProvider({ children }: { children: ReactNode }) {
  const [manualOffline, setManualOffline] = useState(false);
  const [browserOffline, setBrowserOffline] = useState(false);

  useEffect(() => {
    setBrowserOffline(!navigator.onLine);
    const onOnline = () => setBrowserOffline(false);
    const onOffline = () => setBrowserOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const isOffline = manualOffline || browserOffline;

  return (
    <ConnectivityContext.Provider value={{ isOffline, toggle: () => setManualOffline((v) => !v) }}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  return useContext(ConnectivityContext);
}
