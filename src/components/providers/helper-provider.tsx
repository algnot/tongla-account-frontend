"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlertContext } from "./alert-provider";
import { useFullLoadingContext } from "./full-loading-provider";
import { BackendClient } from "@/lib/request";
import { useRouter, useSearchParams } from "next/navigation";
import { isErrorResponse, UserInfo } from "@/types/request";
import { useConfirmCodeContext } from "./confirm-code-provider"

interface HeaderContextType {
  title: string;
  setTitle: (title: string) => void;
}

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
  userData: UserInfo | null;
  header: HeaderContextType;
  setConfirmCode: (
    title: string, 
    text: string, 
    action: void | ((code: string) => void)
  ) => void;
}

const HelperContext = createContext<() => HelperContextType>(() => {
  return {
    setAlert: () => {},
    setFullLoading: () => {},
    backendClient: new BackendClient(() => {}),
    router: useRouter(),
    searchParams: useSearchParams(),
    userData: null,
    header: {
      title: "",
      setTitle: () => {},
    },
    setConfirmCode: () => {},
  };
});

export function HelperProvider({ children }: { children: ReactNode }) {
  const setAlert = useAlertContext();
  const setFullLoading = useFullLoadingContext();
  const setConfirmCode = useConfirmCodeContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const backendClient = new BackendClient(setAlert);
      const response = await backendClient.getUserInfo();
      if (!isErrorResponse(response)) {
        setUserData(response);
      }
    };
    fetchUserData();
  }, [setAlert]);

  const useHelper = useCallback(
    () => ({
      setAlert,
      setFullLoading,
      backendClient: new BackendClient(setAlert),
      router,
      searchParams,
      userData,
      header: {
        title,
        setTitle,
      },
      setConfirmCode
    }),
    [setAlert, setFullLoading, router, searchParams, userData, title, setConfirmCode]
  );

  return (
    <HelperContext.Provider value={useHelper}>
      {children}
    </HelperContext.Provider>
  );
}

export const useHelperContext = () => useContext(HelperContext);
