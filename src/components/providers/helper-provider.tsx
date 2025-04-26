"use client";

import { createContext, ReactNode, useCallback, useContext } from "react";
import { useAlertContext } from "./alert-provider";
import { useFullLoadingContext } from "./full-loading-provider";
import { BackendClient } from "@/lib/request";
import { useRouter, useSearchParams } from "next/navigation";

interface HelperContextType {
  setAlert: (
    title: string,
    text: string,
    action: number | (() => void),
    canCancel: boolean
  ) => void;
  setFullLoading: (value: boolean) => void;
  backendClient: BackendClient;
  router: ReturnType<typeof useRouter>;
  searchParams: ReturnType<typeof useSearchParams>;
}

const HelperContext = createContext<() => HelperContextType>(() => ({
  setAlert: () => {},
  setFullLoading: () => {},
  backendClient: new BackendClient(() => {}),
  router: useRouter(),
  searchParams: useSearchParams(),
}));

export function HelperProvider({ children }: { children: ReactNode }) {
  const setAlert = useAlertContext();
  const setFullLoading = useFullLoadingContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const useHelper = useCallback(() => {
    const backendClient = new BackendClient(setAlert);

    return {
      setAlert,
      setFullLoading,
      backendClient,
      router,
      searchParams,
    };
  }, [setAlert, setFullLoading, router, searchParams]);

  return (
    <HelperContext.Provider value={useHelper}>
      {children}
    </HelperContext.Provider>
  );
}

export const useHelperContext = () => useContext(HelperContext);
