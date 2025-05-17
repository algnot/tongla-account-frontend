/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import {
  IconFileWord,
  IconHelp,
  IconLock,
  IconNotification,
  IconServer,
  IconUser,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const data = {
  navMain: [
    {
      title: "Personal Information",
      url: "/account",
      icon: IconUser,
    },
    {
      title: "Notification",
      url: "/account/notification",
      icon: IconNotification,
    },
    {
      title: "Security",
      url: "/account/security",
      icon: IconLock,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "/account/help",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Service",
      url: "/account/developer/service",
      icon: IconServer,
    },
    {
      name: "Documentaion",
      url: "https://openidconnect.net/",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme: currentTheme } = useTheme();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, [currentTheme]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                {theme === "light" ? (
                  <img
                    src="/icon/logo_black.png"
                    alt="logo icon"
                    className="h-8"
                  />
                ) : (
                  <img
                    src="/icon/logo_white.png"
                    alt="logo icon"
                    className="h-8"
                  />
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
