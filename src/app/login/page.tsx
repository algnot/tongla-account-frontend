/* eslint-disable @next/next/no-img-element */

"use client";
import { useState, useEffect, useRef } from "react";
import { ModeToggle } from "@/components/ui/switch-themes";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useHelperContext } from "@/components/providers/helper-provider";
import { isErrorResponse } from "@/types/request";
import { KeyRound, Mail } from "lucide-react";

export default function LoginPage() {
  const { theme: currentTheme } = useTheme();
  const { setFullLoading, backendClient } = useHelperContext()();
  const [theme, setTheme] = useState("dark");
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isMethodEnabled, setIsMethodEnabled] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, [currentTheme]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFullLoading(true);

    if (is2FAEnabled) {
      return onSubmit2FA();
    }

    const form = formRef.current;
    const email = form?.email?.value ?? "";
    const response = await backendClient.login(email);

    setFullLoading(false);
    if (isErrorResponse(response)) {
      return;
    }

    setIsMethodEnabled(true);
  };

  const onSubmit2FA = async () => {
    const form = formRef.current;
    const code = form?.code?.value ?? "";
    const response = await backendClient.loginWithCode({
      email: form?.email?.value ?? "",
      code,
    });

    setFullLoading(false);
    if (isErrorResponse(response)) {
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          {theme === "light" ? (
            <img src="/icon/logo_black.png" alt="logo icon" className="h-12" />
          ) : (
            <img src="/icon/logo_white.png" alt="logo icon" className="h-12" />
          )}
        </div>
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>
                Manage your account with password less
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      disabled={isMethodEnabled}
                      required
                    />
                  </div>

                  {is2FAEnabled && (
                    <div className="grid gap-3">
                      <Label htmlFor="code">2FA code</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="123456"
                        required
                      />
                    </div>
                  )}

                  {isMethodEnabled && !is2FAEnabled && (
                    <div className="flex flex-col gap-2">
                      <Label>Choose your login method</Label>
                      <div className="flex flex-col gap-2 mt-2">
                        <Button
                          variant="outline"
                          type="button"
                          className="w-full justify-start gap-2"
                          onClick={() => setIs2FAEnabled(true)}
                        >
                          <KeyRound className="h-4 w-4" />
                          Enter 2FA code
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          className="w-full justify-start gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Get login link by email
                        </Button>
                      </div>
                    </div>
                  )}

                  {(is2FAEnabled || (!isMethodEnabled && !is2FAEnabled)) && (
                    <Button
                      type="submit"
                      className="w-full border-2 cursor-pointer"
                    >
                      Login
                    </Button>
                  )}
                </div>

                {!isMethodEnabled && (
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="/sign-up" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground text-center text-xs text-balance">
            © Tongla 2025
          </div>
        </form>
      </div>
    </div>
  );
}
