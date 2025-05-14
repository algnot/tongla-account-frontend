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
export default function LoginPage() {
  const { setFullLoading, backendClient, router } =
    useHelperContext()();
  const { theme: currentTheme } = useTheme();
  const [theme, setTheme] = useState("dark");
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, [currentTheme]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFullLoading(true);
    const form = formRef.current;
    const username = form?.username?.value ?? "";
    const firstname = form?.firstname?.value ?? "";
    const lastname = form?.lastname?.value ?? "";
    const email = form?.email?.value ?? "";

    const response = await backendClient.register({
      username,
      firstname,
      lastname,
      email,
    });

    setFullLoading(false);

    if (isErrorResponse(response)) {
      return;
    }

    router.push(`/sign-up/verify?email=${email}`);
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
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Manage your account with password less
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-6" onSubmit={onSubmit} ref={formRef}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="username">username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="firstname">firstname</Label>
                    <Input
                      id="firstname"
                      type="text"
                      placeholder="john"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lastname">lastname</Label>
                    <Input
                      id="lastname"
                      type="text"
                      placeholder="doe"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full border-2 cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Login
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground text-center text-xs text-balance">
            © Tongla 2025
          </div>
        </div>
      </div>
    </div>
  );
}
