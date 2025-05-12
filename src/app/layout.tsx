import type { Metadata } from "next";
import "./globals.css";
import { AlertDialogProvider } from "@/components/providers/alert-provider";
import { Suspense } from "react";
import { FullLoadingProvider } from "@/components/providers/full-loading-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { HelperProvider } from "@/components/providers/helper-provider";
import { ConfirmCodeProvider } from "@/components/providers/confirm-code-provider";

export const metadata: Metadata = {
  title: "tongla account service",
  description: "password less account service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Suspense fallback={<div></div>}>
            <AlertDialogProvider>
              <FullLoadingProvider>
                <ConfirmCodeProvider>
                  <HelperProvider>{children}</HelperProvider>
                </ConfirmCodeProvider>
              </FullLoadingProvider>
            </AlertDialogProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
