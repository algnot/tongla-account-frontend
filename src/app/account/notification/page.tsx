/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  LogIn,
  Bell,
  Mail,
  LockKeyhole,
  User,
  AlertTriangle,
} from "lucide-react";
import { isErrorResponse, Notification } from "@/types/request";
import { formatDiff } from "@/lib/utils";

export default function Page() {
  const { header, backendClient } = useHelperContext()();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    header.setTitle("Notification");
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await backendClient.getAllNotifications();
    if (isErrorResponse(response)) {
      return;
    }

    const sorted = [...response.notifications].sort((a, b) => {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    setNotifications(sorted);
  };

  const iconMapping = {
    login: <LogIn className="w-12 h-12 text-gray-300" />,
    email: <Mail className="w-12 h-12 text-gray-300" />,
    password: <LockKeyhole className="w-12 h-12 text-gray-300" />,
    user: <User className="w-12 h-12 text-gray-300" />,
    alert: <AlertTriangle className="w-12 h-12 text-gray-300" />,
    default: <Bell className="w-12 h-12 text-gray-300" />,
  };

  return (
    <div className="p-6">
      <Card className="p-4">
        <h1 className="text-xl font-bold">Notification</h1>
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            return (
              <Card
                className="p-4 flex flex-col gap-3 justify-start"
                key={index}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {iconMapping[
                      notification.reason as keyof typeof iconMapping
                    ] ?? iconMapping["default"]}
                    <div>
                      <div className="flex gap-1 items-center">
                        <div className="font-semibold text-lg">
                          {notification.title}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-500">
                          {formatDiff(new Date(notification.created).valueOf())}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="text-sm">
                    <div className="text-gray-500">{notification.content}</div>
                  </div>
                </div>
              </Card>
            );
          })}
          {notifications.length === 0 && (
            <div className="text-center text-muted-foreground">
              no notification found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
