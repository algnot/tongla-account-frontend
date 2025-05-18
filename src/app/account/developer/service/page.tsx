"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isErrorResponse, Service } from "@/types/request";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const { header, backendClient, userData, setFullLoading, setAlert } =
    useHelperContext()();
  const [services, setServices] = useState<Service[]>([]);
  const [showSecrets, setShowSecrets] = useState<Record<number, boolean>>({});
  const [showAddService, setShowAddService] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<Record<number, boolean>>({});

  useEffect(() => {
    header.setTitle("Service");
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const response = await backendClient.getAllServices();
    if (isErrorResponse(response)) return;
    setServices(response.services ?? []);
  };

  const toggleSecret = (index: number) => {
    setShowSecrets((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleDetail = (index: number) => {
    setShowDetails((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const AddServiceComponent = (props: { onCancel: () => void }) => {
    const formRef = useRef<HTMLFormElement | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = formRef.current;
      const serviceName = form?.serviceName?.value ?? "";
      const redirectUri = form?.redirectUri?.value ?? "";
      const issuer = form?.issuer?.value ?? "";

      setFullLoading(true);
      const response = await backendClient.addService({
        redirect_uri: redirectUri,
        name: serviceName,
        issuer,
      });
      setFullLoading(false);

      if (isErrorResponse(response)) return;
      fetchData();
      setAlert("success", `Your service is created`, () => {
        props.onCancel();
      }, false);
    };

    return (
      <form
        className="fixed flex top-0 left-0 z-10 h-full justify-center items-center w-full bg-[#00000045]"
        onSubmit={onSubmit}
        ref={formRef}
      >
        <Card className="p-4 flex flex-col gap-2 justify-start h-fit min-w-96">
          <h1 className="text-xl font-bold">Add Service</h1>
          <div className="grid gap-3 mb-3">
            <Label htmlFor="serviceName">Service name</Label>
            <Input id="serviceName" type="text" placeholder="OpenId Service" required />
          </div>
          <div className="grid gap-3 mb-3">
            <Label htmlFor="redirectUri">Redirect URI</Label>
            <Input
              id="redirectUri"
              type="text"
              placeholder="https://account.tongla.dev/callback"
              required
            />
          </div>
          <div className="grid gap-3 mb-5">
            <Label htmlFor="issuer">Issuer</Label>
            <Input
              id="issuer"
              type="text"
              placeholder="issuer"
              defaultValue={userData?.username}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" type="button" onClick={props.onCancel}>
              cancel
            </Button>
            <Button type="submit">confirm</Button>
          </div>
        </Card>
      </form>
    );
  };

  return (
    <div className="p-6">
      <Card className="p-4">
        <h1 className="text-xl font-bold">Service</h1>
        <div className="flex justify-start">
          <Button className="w-fit" onClick={() => setShowAddService(true)}>
            Add new service
          </Button>
        </div>
        {showAddService && (
          <AddServiceComponent onCancel={() => setShowAddService(false)} />
        )}

        {services?.map((service, index) => (
          <Card className="p-4 flex flex-col gap-3 justify-start" key={index}>
            <div className="flex items-start justify-between">
              <div className="font-semibold text-lg">{service.name}</div>
              <div
                onClick={() => toggleDetail(index)}
                className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer hover:underline"
              >
                {showDetails[index] ? "Hide details" : "Show details"}
                {showDetails[index] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>

            <div>
              <div className="text-sm mb-1">Client id</div>
              <Input value={service.client_id} disabled />
            </div>

            <AnimatePresence initial={false}>
              {showDetails[index] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden flex flex-col gap-3"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}

        {services?.length === 0 && (
          <div className="text-center text-muted-foreground">
            no service found
          </div>
        )}
      </Card>
    </div>
  );
}
