/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect, useRef, useState } from "react";
import { IconCamera } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { isErrorResponse } from "@/types/request";
import { Copy, Check } from "lucide-react";

export default function Page() {
  const {
    header,
    userData,
    setConfirmCode,
    backendClient,
    setFullLoading,
    setAlert,
  } = useHelperContext()();
  const [gender, setGender] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    header.setTitle("Personal Information");
  }, []);

  useEffect(() => {
    if (userData?.gender) {
      setGender(userData.gender);
    }
  }, [userData]);

  const handleCopyUid = async (uid: string) => {
    await navigator.clipboard.writeText(uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = formRef.current;
    const username = form?.username?.value ?? "";
    const firstname = form?.firstname?.value ?? "";
    const lastname = form?.lastname?.value ?? "";
    const birthdate = form?.birthdate?.value ?? "";
    const phone = form?.phone?.value ?? "";
    const address = form?.address?.value ?? "";

    setConfirmCode(
      "Enter your 2FA Code",
      "to update your profile you want to enter 2FA Code",
      async (code) => {
        setFullLoading(true);
        const payload = {
          username,
          firstname,
          lastname,
          gender,
          birthdate,
          phone,
          address,
          code,
        };

        const response = await backendClient.updateUserInfo(payload);
        setFullLoading(false);
        if (isErrorResponse(response)) {
          return;
        }

        setAlert(
          "success",
          `Your account is updated`,
          () => {
            window.location.reload();
          },
          false
        );
      }
    );
  };

  return (
    <form className="p-4" onSubmit={onSubmit} ref={formRef}>
      <div className="rounded-xl border p-4">
        <div className="text-xl font-medium mb-5">Basic information</div>
        <Button
          variant="outline"
          type="button"
          className="flex h-fit w-full justify-between items-center gap-2 mt-2 p-3 px-5 rounded-xl border"
        >
          <div className="text-md text-gray-500 mb-2">Profile Picture</div>
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-end justify-center overflow-hidden cursor-pointer">
            <div className="bg-[#0000002d] p-2 w-full flex items-center justify-center">
              <IconCamera size={15} stroke={1.5} className="text-gray-500" />
            </div>
          </div>
        </Button>

        <div className="mt-4">
          <Label htmlFor="username">username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="username"
            className="mt-2"
            defaultValue={userData?.username}
            onChange={() => setHasChanged(true)}
          />
        </div>

        <div className="mt-5">
          <Label htmlFor="firstname" className="mb-2">
            firstname
          </Label>
          <Input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="firstname"
            defaultValue={userData?.firstname}
            onChange={() => setHasChanged(true)}
          />
        </div>

        <div className="mt-5">
          <Label htmlFor="lastname" className="mb-2">
            lastname
          </Label>
          <Input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="lastname"
            defaultValue={userData?.lastname}
            onChange={() => setHasChanged(true)}
          />
        </div>

        <div className="mt-5">
          <Label htmlFor="birthdate" className="mb-2">
            birthdate
          </Label>
          <Input
            type="date"
            id="birthdate"
            name="birthdate"
            placeholder="birthdate"
            defaultValue={userData?.birthdate}
            onChange={() => setHasChanged(true)}
          />
        </div>

        <div className="mt-5">
          <Label htmlFor="gender" className="mb-4">
            gender
          </Label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => {
              setGender(value);
              setHasChanged(true);
            }}
            className="flex gap-5"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="notToSay" id="notToSay" />
              <Label htmlFor="notToSay">not to say</Label>
            </div>
          </RadioGroup>
          <div className="flex justify-end">
            <Button className="mt-3" disabled={!hasChanged}>
              save
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4 mt-5">
        <div className="text-xl font-medium">Contact information</div>
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-5">
          <div className="mt-5 relative">
            <Label htmlFor="uid" className="mb-2">
              uid
            </Label>
            <Input
              type="password"
              id="uid"
              name="uid"
              placeholder="your uid"
              disabled
              defaultValue={userData?.id}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-muted-foreground"
              onClick={() => handleCopyUid(userData?.id ?? "")}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <div className="mt-5">
            <Label htmlFor="email" className="mb-2">
              email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="your email"
              disabled
              defaultValue={userData?.email}
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="phone">phone</Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            placeholder="phone"
            className="mt-2"
            defaultValue={userData?.phone}
            onChange={() => setHasChanged(true)}
          />
        </div>

        <div className="mt-5">
          <Label htmlFor="address" className="mb-2">
            address
          </Label>
          <Input
            type="text"
            id="address"
            name="address"
            placeholder="address"
            defaultValue={userData?.address}
            onChange={() => setHasChanged(true)}
          />
        </div>
        <div className="flex justify-end">
          <Button className="mt-3" disabled={!hasChanged}>
            save
          </Button>
        </div>
      </div>
    </form>
  );
}
