/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect } from "react";

export default function Home() {
  const { userData, router } = useHelperContext()();

  useEffect(() => {
    if (userData?.id == "") {
      router.push("/login");
    }
  }, [userData]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"></div>
  );
}
