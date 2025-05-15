/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isErrorResponse } from "@/types/request";
import React, { useEffect, useRef, useState } from "react";

export default function VerifyEmailPage() {
  const { searchParams, backendClient, setFullLoading, setAlert, router } =
    useHelperContext()();
  const token = searchParams.get("token");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    setFullLoading(true);
    const response = await backendClient.verifyEmail({ token: token ?? "" });
    setFullLoading(false);
    if (isErrorResponse(response)) {
      return;
    }

    setQrCode(response.qr_code);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    const code = form?.code?.value ?? "";

    setFullLoading(true);
    const response = await backendClient.verify2FA({
      token: token ?? "",
      code,
    });
    setFullLoading(false);

    if (isErrorResponse(response)) {
      return;
    }

    setAlert(
      "success",
      `Your ${response.username} account has been verified successfully`,
      () => {
        router.push("/login");
      },
      false
    );
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="flex flex-col gap-6 border-2 rounded-xl p-6 max-w-[500px]"
      >
        <h1 className="text-2xl font-bold">Add your 2FA</h1>
        <p className="text-sm text-muted-foreground">
          Scan the QR code with your authenticator app
        </p>
        <img src={qrCode ?? ""} alt="qr code" className="rounded-xl" />
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="code">Enter the code</Label>
            <Input
              id="code"
              type="code"
              placeholder="Enter the code"
              required
            />
            <Button type="submit">Verify 2FA</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
