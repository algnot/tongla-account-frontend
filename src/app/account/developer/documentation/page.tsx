/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect } from "react";

export default function Page() {
  const { header } = useHelperContext()();

  useEffect(() => {
    header.setTitle("Documentation");
  }, []);

  return <div>coming soon</div>;
}
