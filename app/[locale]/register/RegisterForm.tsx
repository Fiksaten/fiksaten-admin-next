"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "@/components/FormInput";
import { FormTextarea } from "@/components/FormTextarea";
import { createAccountLink } from "@/app/lib/services/billingClientService";
import { useTranslations } from "next-intl";
import { ContractorRegisterData, Register } from "@/app/lib/types/authTypes";

const getConsumerSchema = () => {
  const t = useTranslations("");

  return Yup.object().shape({
    firstname: Yup.string().required(
      t("register.firstName") + t("validation.required")
    ),
    lastname: Yup.string().required(
      t("register.lastName") + t("validation.required")
    ),
    email: Yup.string()
      .email(t("register.email") + t("validation.invalid"))
      .required(t("register.email") + t("validation.required")),
    password: Yup.string()
      .matches(/\w*[a-z]\w*/, t("validation.password.lowercase"))
      .matches(/\w*[A-Z]\w*/, t("validation.password.uppercase"))
      .matches(/\d/, t("validation.password.number"))
      .matches(/[!@#$%^&*+:]/, t("validation.password.special"))
      .min(8, t("validation.password.min").replace("{{min}}", "8"))
      .required(t("register.password") + t("validation.required")),
    phoneNumber: Yup.string().required(
      t("register.phone") + t("validation.required")
    ),
  });
};

const getContractorSchema = () => {
  const t = useTranslations("");

  return getConsumerSchema().shape({
    companyName: Yup.string().required(
      t("register.companyName") + t("validation.required")
    ),
    companyEmail: Yup.string()
      .email(t("register.companyEmail") + t("validation.invalid"))
      .required(t("register.companyEmail") + t("validation.required")),
    companyPhone: Yup.string().required(
      t("register.companyPhone") + t("validation.required")
    ),
    businessId: Yup.string().required(
      t("register.businessId") + t("validation.required")
    ),
  });
};
export default function RegisterForm({
  type = "consumer",
}: {
  type: "contractor" | "consumer";
}) {
  const t = useTranslations("");
  const [userType, setUserType] = useState<"consumer" | "contractor">(type);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();
  const { register: authRegister } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(
      userType === "consumer" ? getConsumerSchema() : getContractorSchema()
    ),
    mode: "onBlur",
  });

  useEffect(() => {
    setUserType(type);
  }, [type]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const registerData: Register = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
      };

      let contractorRegisterData: ContractorRegisterData | undefined;
      if (userType === "contractor") {
        contractorRegisterData = {
          name: data.companyName,
          description: data.companyDescription,
          website: data.companyWebsite,
          email: data.companyEmail,
          phone: data.companyPhone,
          addressStreet: data.companyAddressStreet,
          addressDetail: data.companyAddressDetail,
          addressZip: data.companyAddressZip,
          addressCountry: data.companyAddressCountry,
          imageUrl: data.companyImageUrl,
          businessId: data.businessId,
          businessType: data.businessType,
          categoryId: data.categoryId,
          iban: data.iban,
          bic: data.bic,
        };
      }

      await authRegister(registerData, contractorRegisterData);
      toast({
        title: t("verification.registerSuccess"),
        description: t("verification.registerSuccessDescription"),
      });
      setIsVerifying(true);
    } catch (error) {
      console.error("Error registering user:", error);
      toast({
        title: t("verification.registerFailed"),
        description: t("verification.registerFailedDescription"),
        variant: "destructive",
      });
    }
  };

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
            <RadioGroupItem
              className="h-4 w-4"
              value="consumer"
              id="consumer"
            />
            <Label className="text-black text-[16px]" htmlFor="consumer">
              {t("register.consumer")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              className="h-4 w-4"
              value="contractor"
              id="contractor"
            />
            <Label className="text-black text-[16px]" htmlFor="contractor">
              {t("register.contractor")}
            </Label>
          </div>
        </RadioGroup>

        <div className="grid sm:grid-cols-2 grid-cols-1 items-center sm:items-stretch gap-4">
          <FormInput
            placeholder={
              t("register.holder") + t("register.firstName").toLowerCase()
            }
            id="firstname"
            label={t("register.firstName")}
            registration={register("firstname")}
            error={errors.firstname?.message}
          />
          <FormInput
            placeholder={
              t("register.holder") + t("register.lastName").toLowerCase()
            }
            id="lastname"
            label={t("register.lastName")}
            registration={register("lastname")}
            error={errors.lastname?.message}
          />
          <FormInput
            placeholder={
              t("register.holder") + t("register.email").toLowerCase()
            }
            id="email"
            type="email"
            label={t("register.email")}
            registration={register("email")}
            error={errors.email?.message}
          />
          <FormInput
            placeholder={
              t("register.holder") + t("register.password").toLowerCase()
            }
            id="password"
            type="password"
            label={t("register.password")}
            registration={register("password")}
            error={errors.password?.message}
          />
          <FormInput
            placeholder={
              t("register.holder") + t("register.phone").toLowerCase()
            }
            id="phoneNumber"
            type="tel"
            label={t("register.phone")}
            registration={register("phoneNumber")}
            error={errors.phoneNumber?.message}
          />
          {userType === "contractor" && (
            <>
              <FormInput
                placeholder={
                  t("register.holder") + t("register.companyName").toLowerCase()
                }
                id="companyName"
                label={t("register.companyName")}
                registration={register("companyName")}
                error={errors.companyName?.message}
              />
              <FormInput
                placeholder={
                  t("register.holder") +
                  t("register.companyEmail").toLowerCase()
                }
                id="companyEmail"
                type="email"
                label={t("register.companyEmail")}
                registration={register("companyEmail")}
                error={errors.companyEmail?.message}
              />
              <FormInput
                placeholder={
                  t("register.holder") +
                  t("register.companyPhone").toLowerCase()
                }
                id="companyPhone"
                type="tel"
                label={t("register.companyPhone")}
                registration={register("companyPhone")}
                error={errors.companyPhone?.message}
              />
              <FormInput
                placeholder={t("register.holder") + t("register.businessId")}
                id="businessId"
                label={t("register.businessId")}
                registration={register("businessId")}
                error={errors.businessId?.message}
              />
              <FormTextarea
                placeholder={
                  t("register.holder") +
                  t("register.companyDescription").toLowerCase()
                }
                id="companyDescription"
                label={t("register.companyDescription")}
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
          {t("register.register")}
        </Button>
      </form>
    </div>
  );
}
