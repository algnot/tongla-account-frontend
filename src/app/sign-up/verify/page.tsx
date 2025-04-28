"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Button } from "@/components/ui/button";
import { isErrorResponse } from "@/types/request";
import React from "react";

export default function VerifyPage() {
  const { searchParams, backendClient, setAlert, router, setFullLoading } = useHelperContext()();
  const email = searchParams.get("email");

  const onResendVerificationEmail = async () => {
    setFullLoading(true);
    const response = await backendClient.login(email ?? "");
    setFullLoading(false);

    if (isErrorResponse(response)) {
      return;
    }

    setAlert("error", "Your account is already verified try to login", () => {
      router.push("/login");
    }, false);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex flex-col gap-6 border-2 rounded-xl p-6 max-w-[500px]">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          Please check your <span className="text-red-500">{email}</span> for
          continue
        </p>
        <Button onClick={onResendVerificationEmail}>Resend verification email</Button>
      </div>
    </div>
  );
}
