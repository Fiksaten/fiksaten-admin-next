"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { ContractorRegisterData, RegisterData } from "../../lib/types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dictionary } from "@/lib/dictionaries";
import { FormInput } from "@/components/FormInput";
import {FormTextarea} from "@/components/FormTextarea";

const getConsumerSchema = (dict: Dictionary) =>
  Yup.object().shape({
    firstname: Yup.string().required(
      dict.register.firstName + dict.validation.required
    ),
    lastname: Yup.string().required(
      dict.register.lastName + dict.validation.required
    ),
    email: Yup.string()
      .email(dict.register.email + dict.validation.invalid)
      .required(dict.register.email + dict.validation.required),
    password: Yup.string()
      .matches(/\w*[a-z]\w*/, dict.validation.password.lowercase)
      .matches(/\w*[A-Z]\w*/, dict.validation.password.uppercase)
      .matches(/\d/, dict.validation.password.number)
      .matches(/[!@#$%^&*+:]/, dict.validation.password.special)
      .min(8, dict.validation.password.min.replace("{{min}}", "8"))
      .required(dict.register.password + dict.validation.required),
    phoneNumber: Yup.string().required(
      dict.register.phone + dict.validation.required
    ),
  });

const getContractorSchema = (dict: Dictionary) =>
  getConsumerSchema(dict).shape({
    companyName: Yup.string().required(
      dict.register.companyName + dict.validation.required
    ),
    companyEmail: Yup.string()
      .email(dict.register.companyEmail + dict.validation.invalid)
      .required(dict.register.companyEmail + dict.validation.required),
    companyPhone: Yup.string().required(
      dict.register.companyPhone + dict.validation.required
    ),
    businessId: Yup.string().required(
      dict.register.businessId + dict.validation.required
    ),
  });

export default function RegisterForm({
  type = "consumer",
  dict,
}: {
  type: "contractor" | "consumer";
  dict: Dictionary;
}) {
  const [userType, setUserType] = useState<"consumer" | "contractor">(type);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();
  const { register: authRegister, verifyPhone } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(
      userType === "consumer"
        ? getConsumerSchema(dict)
        : getContractorSchema(dict)
    ),
    mode: "onBlur",
  });

  useEffect(() => {
    setUserType(type);
  }, [type]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (userType === "contractor") {
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
        title: dict.verification.registerSuccess,
        description: dict.verification.registerSuccessDescription,
      });
      setIsVerifying(true);
    } catch (error) {
      console.error("Error registering user:", error);
      toast({
        title: dict.verification.registerFailed,
        description: dict.verification.registerFailedDescription,
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
          title: dict.verification.verificationSuccess,
          description: dict.verification.verificationSuccessDescription,
        });
        setIsVerifying(false);
        if (userType === "consumer") {
          router.push("/consumer/dashboard");
        } else {
          router.push("/contractor");
        }
      } else {
        toast({
          title: dict.verification.verificationFailed,
          description: dict.verification.verificationFailedDescription,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying phone:", error);
      toast({
        title: dict.verification.verificationFailed,
        description: dict.verification.verificationFailedDescription,
        variant: "destructive",
      });
    }
  };

  if (isVerifying) {
    return (
      <div className="container py-6">
        <h2 className="text-2xl font-bold mb-4">{dict.verification.phone}</h2>
        <p className="mb-4">{dict.verification.enter}</p>
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
        <Button
          onClick={handleVerifyPhone}
          className="bg-[#007bff] w-full text-white p-3 my-12 font-semibold"
        >
          {dict.verification.send}
        </Button>
      </div>
    );
  }

  return (
      <div className="w-full flex flex-col justify-center space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <RadioGroup
              value={userType}
              onValueChange={(value: "consumer" | "contractor") =>
                  setUserType(value)
              }
              className="flex space-x-4 mb-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="h-4 w-4" value="consumer" id="consumer"/>
              <Label className="text-black text-[16px]" htmlFor="consumer">
                {dict.register.consumer}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="h-4 w-4" value="contractor" id="contractor"/>
              <Label className="text-black text-[16px]" htmlFor="contractor">
                {dict.register.contractor}
              </Label>
            </div>
          </RadioGroup>

          <div className="grid sm:grid-cols-2 grid-cols-1 items-center sm:items-stretch gap-4">
            <FormInput
                placeholder={dict.register.holder + dict.register.firstName.toLowerCase()}
                id="firstname"
                label={dict.register.firstName}
                registration={register("firstname")}
                error={errors.firstname?.message}
            />
            <FormInput
                placeholder={dict.register.holder + dict.register.lastName.toLowerCase()}
                id="lastname"
                label={dict.register.lastName}
                registration={register("lastname")}
                error={errors.lastname?.message}
            />
          <FormInput
              placeholder={dict.register.holder + dict.register.email.toLowerCase()}
              id="email"
              type="email"
              label={dict.register.email}
              registration={register("email")}
              error={errors.email?.message}
          />
          <FormInput
              placeholder={dict.register.holder + dict.register.password.toLowerCase()}
              id="password"
              type="password"
              label={dict.register.password}
              registration={register("password")}
              error={errors.password?.message}
          />
          <FormInput
              placeholder={dict.register.holder + dict.register.phone.toLowerCase()}
              id="phoneNumber"
              type="tel"
              label={dict.register.phone}
              registration={register("phoneNumber")}
              error={errors.phoneNumber?.message}
          />
          {userType === "contractor" && (
              <>
                <FormInput
                    placeholder={dict.register.holder + dict.register.companyName.toLowerCase()}
                    id="companyName"
                    label={dict.register.companyName}
                    registration={register("companyName")}
                    error={errors.companyName?.message}
                />
                <FormInput
                    placeholder={dict.register.holder + dict.register.companyEmail.toLowerCase()}
                    id="companyEmail"
                    type="email"
                    label={dict.register.companyEmail}
                    registration={register("companyEmail")}
                    error={errors.companyEmail?.message}
                />
                <FormInput
                    placeholder={dict.register.holder + dict.register.companyPhone.toLowerCase()}
                    id="companyPhone"
                    type="tel"
                    label={dict.register.companyPhone}
                    registration={register("companyPhone")}
                    error={errors.companyPhone?.message}
                />
                <FormInput
                    placeholder={dict.register.holder + dict.register.businessId}
                    id="businessId"
                    label={dict.register.businessId}
                    registration={register("businessId")}
                    error={errors.businessId?.message}
                />
                <FormTextarea
                    placeholder={dict.register.holder + dict.register.companyDescription.toLowerCase()}
                    id="companyDescription"
                    label={dict.register.companyDescription}
                    registration={register("companyDescription")}
                    error={errors.companyDescription?.message}
                />
              </>
          )}
          </div>
          <Button
              className="bg-[#007bff] w-full max-w-[250px] text-white p-3 font-semibold"
              type="submit"
              disabled={isSubmitting}
          >
            {dict.register.register}
          </Button>
        </form>
      </div>
  );
}
