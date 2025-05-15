/* eslint-disable @next/next/no-img-element */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GetServiceResponse, isErrorResponse } from "@/types/request";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { backendClient, userData } = useHelperContext()();
  const { theme: currentTheme } = useTheme();
  const [theme, setTheme] = useState("dark");
  const [redirect, setRedirect] = useState("");
  const [service, setService] = useState<GetServiceResponse>();

  useEffect(() => {
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, [currentTheme]);

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
          encodeURIComponent(window.location.href),
        );
        window.location.href = "/login?redirect=" + redirectUrl;
      }
      return;
    }
    setRedirect(response.redirect);
    setService(response);
  };

  const handleAccept = () => {
    window.location.href = redirect;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background px-4">
      <Card className="max-w-md w-full p-6 text-center space-y-4 gap-2">
        <div className="flex justify-center">
          {theme === "light" ? (
            <img src="/icon/logo_black.png" alt="logo icon" className="h-12" />
          ) : (
            <img src="/icon/logo_white.png" alt="logo icon" className="h-12" />
          )}
        </div>
        <div className="text-md font-semibold">Authorization request for {userData?.email}</div>
        <div className="text-2xl font-bold">{service?.name}</div>
        <center>
          <div className="text-xs border rounded-2xl px-2 py-1 bg-foreground text-background w-fit">
            {service?.issuer}
          </div>
        </center>
        <p className="text-sm text-gray-500">
          The application <strong>{service?.name}</strong> is requesting
          permission to access your personal information through our system.
          This includes the following scopes of access:{" "}
          <strong>{service?.scope.replaceAll(" ", ", ")}</strong>. By clicking{" "}
          <strong>Accept</strong>, you agree to share the specified information
          with <strong>{service?.name}</strong>. The information will be used in
          accordance with their privacy policy and terms of service. Please
          ensure that you trust this service before proceeding.
        </p>
        <Button onClick={handleAccept} className="w-full">
          Accept
        </Button>
      </Card>
    </div>
  );
}
