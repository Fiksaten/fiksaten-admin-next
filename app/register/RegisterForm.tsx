/* eslint-disable @typescript-eslint/no-explicit-any */
 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
 // @ts-nocheck
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
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Define validation schemas
const consumerSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
});

const contractorSchema = consumerSchema.shape({
  companyName: Yup.string().required('Company name is required'),
  companyEmail: Yup.string().email('Invalid email').required('Company email is required'),
  companyPhone: Yup.string().required('Company phone is required'),
  businessId: Yup.string().required('Business ID is required'),
});

export function RegisterForm() {
  const [userType, setUserType] = useState<'consumer' | 'contractor'>('consumer');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();
  const { register: authRegister, verifyPhone } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(userType === 'consumer' ? consumerSchema : contractorSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: any) => {
    try {
      const registerData: RegisterData = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,

      };

      let contractorRegisterData: ContractorRegisterData | undefined;
      if (userType === 'contractor') {
        contractorRegisterData = {
          companyName: data.companyName,
          companyEmail: data.companyEmail,
          companyPhone: data.companyPhone,
          businessId: data.businessId,
          companyDescription: data.companyDescription,
          companyImageUrl: data.companyImageUrl,
        };
      }

      await authRegister(registerData, contractorRegisterData);
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
        <Button onClick={handleVerifyPhone} className="bg-[#007bff] w-full text-white p-3 my-12 font-semibold">
          Send
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <RadioGroup
          defaultValue="consumer"
          onValueChange={(value) => setUserType(value as 'consumer' | 'contractor')}
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
            <Label htmlFor="firstname" className="text-black font-semibold">First Name</Label>
            <Input
              id="firstname"
              {...register('firstname')}
            />
            {errors.firstname?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname" className="text-black font-semibold">Last Name</Label>
            <Input
              id="lastname"
              {...register('lastname')}
            />
            {errors.lastname?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-black font-semibold">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            
          />
          {errors.email?.message && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-black font-semibold">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            
          />
          {errors.password?.message && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-black font-semibold">Phone Number</Label>
          <Input
            id="phoneNumber"
            {...register('phoneNumber')}
            
          />
          {errors.phoneNumber?.message && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {userType === "contractor" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-black font-semibold">Company Name</Label>
              <Input
                id="companyName"
                {...register('companyName')}
              />
              {errors.companyName?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyEmail" className="text-black font-semibold">Company Email</Label>
              <Input
                id="companyEmail"
                type="email"
                {...register('companyEmail')}
                
              />
              {errors.companyEmail?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.companyEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyPhone" className="text-black font-semibold">Company Phone</Label>
              <Input
                id="companyPhone"
                {...register('companyPhone')}
                
              />
              {errors.companyPhone?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.companyPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessId" className="text-black font-semibold">Business ID</Label>
              <Input
                id="businessId"
                {...register('businessId')}
                
              />
              {errors.businessId?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.businessId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDescription" className="text-black font-semibold">Company Description</Label>
              <Textarea
                id="companyDescription"
                {...register('companyDescription')}
                
              />
              {errors.companyDescription?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.companyDescription.message}</p>
              )}
            </div>
          </>
        )}
 <Button
          className="bg-[#007bff] w-full text-white p-3 font-semibold"
          type="submit"
          disabled={isSubmitting}
        >
          Register
        </Button>
      </form>
    </div>
  );
}