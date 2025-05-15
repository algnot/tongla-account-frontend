/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isErrorResponse, Service } from "@/types/request";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Page() {
  const { header, backendClient } = useHelperContext()();
  const [services, setServices] = useState<Service[]>([]);
  const [showSecrets, setShowSecrets] = useState<Record<number, boolean>>({});

  useEffect(() => {
    header.setTitle("Service");
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await backendClient.getAllServices();
    if (isErrorResponse(response)) {
      return;
    }
    setServices(response.services);
  };

  const toggleSecret = (index: number) => {
    setShowSecrets((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="p-6">
      <Card className="p-4">
        <h1 className="text-xl font-bold">Service</h1>
        {services.map((service, index) => (
          <Card className="p-4 flex flex-col gap-3 justify-start" key={index}>
            <div className="flex items-start justify-between">
              <div className="flex gap-1 items-center">
                <div className="font-semibold text-lg">{service.name}</div>
              </div>
            </div>
            <div>
              <div className="text-sm mb-1">Client id</div>
              <Input value={service.client_id} disabled />
            </div>
            <div>
              <div className="text-sm mb-1">Client secret</div>
              <div className="relative">
                <Input
                  type={showSecrets[index] ? "text" : "password"}
                  value={service.client_secret}
                  disabled
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  onClick={() => toggleSecret(index)}
                >
                  {showSecrets[index] ? (
                    <EyeOff size={18} className="cursor-pointer" />
                  ) : (
                    <Eye size={18} className="cursor-pointer" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <div className="text-sm mb-1">Redirect uri</div>
              <Input value={service.redirect_uri} disabled />
            </div>
            <div>
              <div className="text-sm mb-1">Issuer</div>
              <Input value={service.issuer} disabled />
            </div>
            <div>
              <div className="text-sm mb-1">Scopes</div>
              <Input value={service.scopes} disabled />
            </div>
            <div>
              <div className="text-sm mb-1">Grant types</div>
              <Input value={service.grant_types} disabled />
            </div>
            <div>
              <div className="text-sm mb-1">Response type</div>
              <Input value={service.response_type} disabled />
            </div>
            <div>
              <div className="text-sm mb-1">Openid configuration uri</div>
              <Input value={service.openid_configuration_uri} disabled />
            </div>
          </Card>
        ))}
        {services.length === 0 && (
          <div className="text-center text-muted-foreground">
            no service found
          </div>
        )}
      </Card>
    </div>
  );
}
