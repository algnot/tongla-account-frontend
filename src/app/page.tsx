/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect } from "react";

export default function Home() {
  const { userData, router } = useHelperContext()();

  useEffect(() => {
    if (userData?.id == "") {
      router.push("/login");
    } else if (userData?.id != "") {
      router.push("/account");
    }
  }, [userData]);

  return <div></div>;
}
