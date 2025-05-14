"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { isErrorResponse } from "@/types/request";
import React, { useEffect } from "react";

export default function Page() {
  const { backendClient } = useHelperContext()();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const params = new URLSearchParams(window.location.search);
    const payload = {
      client_id: params.get("client_id") ?? "",
      domain: params.get("domain") ?? "",
      redirect_uri: params.get("redirect_uri") ?? "",
      response_type: params.get("response_type") ?? "",
      scope: params.get("scope") ?? "",
      state: params.get("state") ?? "",
    };

    const response = await backendClient.getService(payload);
    if (isErrorResponse(response)) {
      if (response.message === "401") {
        const redirectUrl = encodeURIComponent(
          encodeURIComponent(window.location.href)
        );
        window.location.href = "/login?redirect=" + redirectUrl;
      } 
      return
    }
    window.location.href = response.redirect
  };

  return <div></div>;
}
