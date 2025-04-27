/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from "@/components/providers/helper-provider";
import { useEffect } from "react";
import { IconCamera } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export default function Page() {
  const { header, userData } = useHelperContext()();

  useEffect(() => {
    header.setTitle("Personal Information");
  }, []);

  return (
    <form className="p-4">
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
          />
        </div>

        <div className="mt-5">
          <Label htmlFor="birthday" className="mb-2">
            birthday
          </Label>
          <Input
            type="date"
            id="birthday"
            name="birthday"
            placeholder="birthday"
            defaultValue=""
          />
        </div>

        <div className="mt-5">
          <Label htmlFor="gender" className="mb-4">
            gender
          </Label>
          <RadioGroup defaultValue="not-to-say" className="flex gap-5">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-to-say" id="not-to-say" />
              <Label htmlFor="not-to-say">not to say</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="rounded-xl border p-4 mt-5">
        <div className="text-xl font-medium">Contact information</div>
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-5">
          <div className="mt-5">
            <Label htmlFor="uid" className="mb-2">
              uid
            </Label>
            <Input
              type="text"
              id="uid"
              name="uid"
              placeholder="your uid"
              disabled
              defaultValue={userData?.id}
            />
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

          <div className="mt-5">
            <Label htmlFor="email" className="mb-2">
              Email
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
            defaultValue=""
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
            defaultValue=""
          />
        </div>
      </div>
    </form>
  );
}
