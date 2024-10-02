"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { ContractorRegisterData, RegisterData } from "../lib/types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

export function RegisterPageComponent() {
  const [userType, setUserType] = useState("consumer");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phoneNumber: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    businessId: "",
    companyDescription: "",
    companyImageUrl: "",
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { register, verifyPhone } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      firstname,
      lastname,
      email,
      password,
      phoneNumber,
      companyName,
      companyEmail,
      companyPhone,
      businessId,
      companyDescription,
      companyImageUrl,
    } = formData;
    const registerData: RegisterData = {
      firstname,
      lastname,
      email,
      password,
      phoneNumber,
    };
    const contractorRegisterData: ContractorRegisterData = {
      companyDescription,
      companyEmail,
      companyImageUrl,
      companyName,
      companyPhone,
      businessId,
    };

    try {
      await register(
        registerData,
        userType === "contractor" ? contractorRegisterData : undefined
      );
      toast({
        title: "Registration Successful",
        description: "Please verify your phone number.",
      });
      setIsVerifying(true);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyPhone = async () => {
    try {
      const isVerified = await verifyPhone(verificationCode);
      console.log(isVerified);
      if (isVerified) {
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified.",
        });
        setIsVerifying(false);
        if (userType === "consumer") {
          router.push("/consumer/dashboard");
        } else {
          router.push("/contractor");
        }
      } else {
        toast({
          title: "Verification Failed",
          description: "Please check the code and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please check the code and try again.",
        variant: "destructive",
      });
    }
  };

  if (isVerifying) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Verify Your Phone Number</h2>
        <p className="mb-4">Enter the verification code sent to your phone:</p>
        <InputOTP
          value={verificationCode}
          onChange={setVerificationCode}
          maxLength={6}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button onClick={handleVerifyPhone} className="mt-4 w-full">
          Verify Phone Number
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup
          defaultValue="consumer"
          onValueChange={setUserType}
          className="flex space-x-4 mb-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="consumer" id="consumer" />
            <Label htmlFor="consumer">Consumer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="contractor" id="contractor" />
            <Label htmlFor="contractor">Contractor</Label>
          </div>
        </RadioGroup>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              name="firstname"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              name="lastname"
              required
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            required
            onChange={handleInputChange}
          />
        </div>

        {userType === "contractor" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                name="companyEmail"
                type="email"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input
                id="companyPhone"
                name="companyPhone"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessId">Business ID</Label>
              <Input
                id="businessId"
                name="businessId"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDescription">Company Description</Label>
              <Textarea
                id="companyDescription"
                name="companyDescription"
                required
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyImageUrl">
                Company Image URL (Optional)
              </Label>
              <Input
                id="companyImageUrl"
                name="companyImageUrl"
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}
