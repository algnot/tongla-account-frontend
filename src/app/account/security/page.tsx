/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Device, isErrorResponse } from "@/types/request";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatDiff } from "@/lib/utils";
import { Smartphone, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Page() {
  const { header, backendClient, setFullLoading } = useHelperContext()();
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    header.setTitle("Security");
    getAllDevice();
  }, []);

  const getAllDevice = async () => {
    setFullLoading(true);
    const response = await backendClient.getAllDevice();
    setFullLoading(false);

    if (isErrorResponse(response)) return;
    const sorted = [...response.devices].sort((a, b) => {
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return b.issuer_at - a.issuer_at;
    });

    setDevices(sorted);
  };

  const handleDelete = async (sessionId: string) => {
    // TODO: call API to revoke session
    console.log("Delete device session:", sessionId);
  };

  return (
    <div className="p-6">
      <Card className="p-4">
        <h1 className="text-xl font-bold">Devices</h1>
        <div className="space-y-4">
          {devices.map((device, index) => (
            <Card key={index} className="p-4 flex flex-col gap-3 justify-start">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-12 h-12 text-gray-300" />
                  <div>
                    <div className="flex gap-1 items-center">
                      <div className="font-semibold text-lg">
                        {device.device_id ?? "Unknown Device"}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="text-sm border rounded-md px-2 bg-foreground text-background">
                        {device.issuer}
                      </div>
                    </div>
                  </div>
                </div>

                {!device.current ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <MoreVertical className="w-5 h-5 text-muted-foreground cursor-pointer" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDelete(device.session_id)}
                        className="text-red-600 cursor-pointer"
                      >
                        Delete this device
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="text-sm rounded-2xl bg-blue-500 flex items-center justify-center px-3 text-white">
                    Current
                  </div>
                )}
              </div>
              <div className="pl-16 text-sm">
                <div className="text-gray-500">
                  {formatDiff(device.issuer_at)}
                </div>
              </div>
            </Card>
          ))}
          {devices.length === 0 && (
            <div className="text-center text-muted-foreground">
              no devices found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
