"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { User, Building2, ArrowLeft, ArrowRight, Check } from "lucide-react";

// Step indicators component
const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => (
  <div className="flex items-center justify-center space-x-2 mb-6">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div key={i} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            i + 1 < currentStep
              ? "bg-[#35B537] text-white"
              : i + 1 === currentStep
              ? "bg-[#0E54FF] text-white"
              : "bg-[#F4F4F4] text-[#757575]"
          }`}
        >
          {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div
            className={`w-8 h-0.5 mx-2 ${
              i + 1 < currentStep ? "bg-[#35B537]" : "bg-[#F4F4F4]"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// Consumer form schema
const useConsumerSchema = () => {
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

// Personal info form schema (step 1 for contractors)
const useContractorPersonalSchema = () => {
  return useConsumerSchema();
};

// Company info form schema (step 2 for contractors)
const useContractorCompanySchema = () => {
  const t = useTranslations("");
  return Yup.object().shape({
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
    companyDescription: Yup.string().optional(),
  });
};

interface ConsumerFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface ContractorCompanyFormData {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  businessId: string;
  companyDescription?: string;
}

export default function RegisterForm({
  type = "consumer",
}: {
  type: "contractor" | "consumer";
}) {
  const t = useTranslations("");
  const [userType, setUserType] = useState<"consumer" | "contractor">(type);
  const [currentStep, setCurrentStep] = useState(1);
  const [personalData, setPersonalData] = useState<ConsumerFormData | null>(
    null
  );
  const [isRegistering, setIsRegistering] = useState(false);

  const router = useRouter();
  const { register: authRegister } = useAuth();

  // Personal info form (Step 1 for contractors, only step for consumers)
  const consumerSchema = useConsumerSchema();
  const contractorPersonalSchema = useContractorPersonalSchema();
  const personalSchema =
    userType === "consumer" ? consumerSchema : contractorPersonalSchema;
  const personalForm = useForm<ConsumerFormData>({
    resolver: yupResolver(personalSchema),
    mode: "onBlur",
  });

  // Company info form (Step 2 for contractors)
  const companyForm = useForm<ContractorCompanyFormData>({
    resolver: yupResolver(useContractorCompanySchema()),
    mode: "onBlur",
  });

  const handleUserTypeChange = (value: "consumer" | "contractor") => {
    setUserType(value);
    setCurrentStep(1);
    setPersonalData(null);
    personalForm.reset();
    companyForm.reset();
  };

  const handlePersonalSubmit = async (data: ConsumerFormData) => {
    if (userType === "consumer") {
      // Register consumer directly
      await handleRegister(data, undefined);
    } else {
      // Save personal data and move to company info step
      setPersonalData(data);
      setCurrentStep(2);
    }
  };

  const handleCompanySubmit = async (
    companyData: ContractorCompanyFormData
  ) => {
    if (!personalData) return;

    const contractorData: ContractorRegisterData = {
      name: companyData.companyName,
      description: companyData.companyDescription || "",
      website: "",
      email: companyData.companyEmail,
      phone: companyData.companyPhone,
      addressStreet: "",
      addressDetail: "",
      addressZip: "",
      addressCountry: "",
      imageUrl: "",
      businessId: companyData.businessId,
      businessType: "",
      iban: "",
      bic: "",
    };

    await handleRegister(personalData, contractorData);
  };

  const handleRegister = async (
    registerData: Register,
    contractorData?: ContractorRegisterData
  ) => {
    setIsRegistering(true);
    try {
      await authRegister(registerData, contractorData);

      if (userType === "contractor") {
        // Redirect to Stripe account setup
        try {
          const linkResponse = await createAccountLink();
          if (linkResponse?.accountLink?.url) {
            window.location.href = linkResponse.accountLink.url;
            return;
          }
        } catch (error) {
          console.error("Error creating Stripe account link:", error);
          toast({
            title: t("verification.registerSuccess"),
            description:
              "Registration successful. Please set up your payment details in settings.",
          });
          router.push("/contractor/dashboard/settings");
        }
      } else {
        toast({
          title: t("verification.registerSuccess"),
          description: t("verification.registerSuccessDescription"),
        });
        router.push("/consumer/dashboard");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast({
        title: t("verification.registerFailed"),
        description: t("verification.registerFailedDescription"),
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTotalSteps = () => (userType === "contractor" ? 2 : 1);

  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-[800px]  shadow-lg rounded-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#0E54FF]/10 flex items-center justify-center">
                {userType === "consumer" ? (
                  <User className="w-5 h-5 text-[#0E54FF]" />
                ) : (
                  <Building2 className="w-5 h-5 text-[#0E54FF]" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-black dark:text-white">
                {userType === "contractor" && currentStep === 2
                  ? t("register.companyInfo")
                  : t("register.register")}
              </CardTitle>
            </div>
          </div>

          {userType === "contractor" && (
            <StepIndicator
              currentStep={currentStep}
              totalSteps={getTotalSteps()}
            />
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Type Selection */}
          {currentStep === 1 && (
            <>
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-black dark:text-white">
                  {t("register.selectType")}
                </Label>
                <RadioGroup
                  value={userType}
                  onValueChange={handleUserTypeChange}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="consumer"
                      id="consumer"
                      className="w-5 h-5"
                    />
                    <Label
                      htmlFor="consumer"
                      className="text-base text-black dark:text-white cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{t("register.consumer")}</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="contractor"
                      id="contractor"
                      className="w-5 h-5"
                    />
                    <Label
                      htmlFor="contractor"
                      className="text-base text-black dark:text-white cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4" />
                        <span>{t("register.contractor")}</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator className="bg-[#EDEEF1]" />
            </>
          )}

          {/* Personal Information Form */}
          {currentStep === 1 && (
            <form
              onSubmit={personalForm.handleSubmit(handlePersonalSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black dark:text-white flex items-center space-x-2">
                  <User className="w-5 h-5 text-[#0E54FF]" />
                  <span>{t("register.personalInfo")}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    placeholder={t("register.firstName")}
                    id="firstname"
                    label={t("register.firstName")}
                    registration={personalForm.register("firstname")}
                    error={personalForm.formState.errors.firstname?.message}
                  />
                  <FormInput
                    placeholder={t("register.lastName")}
                    id="lastname"
                    label={t("register.lastName")}
                    registration={personalForm.register("lastname")}
                    error={personalForm.formState.errors.lastname?.message}
                  />
                  <FormInput
                    placeholder={t("register.email")}
                    id="email"
                    type="email"
                    label={t("register.email")}
                    registration={personalForm.register("email")}
                    error={personalForm.formState.errors.email?.message}
                  />
                  <FormInput
                    placeholder={t("register.password")}
                    id="password"
                    type="password"
                    label={t("register.password")}
                    registration={personalForm.register("password")}
                    error={personalForm.formState.errors.password?.message}
                  />
                  <FormInput
                    placeholder={t("register.phone")}
                    id="phoneNumber"
                    type="tel"
                    label={t("register.phone")}
                    registration={personalForm.register("phoneNumber")}
                    error={personalForm.formState.errors.phoneNumber?.message}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={
                    personalForm.formState.isSubmitting || isRegistering
                  }
                  className="bg-[#0E54FF] hover:bg-[#0E54FF]/90 text-white px-8 py-3 rounded-full font-semibold min-w-[150px]"
                >
                  {userType === "contractor" ? (
                    <>
                      {t("register.next")}{" "}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    t("register.register")
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Company Information Form (Step 2 for contractors) */}
          {currentStep === 2 && userType === "contractor" && (
            <form
              onSubmit={companyForm.handleSubmit(handleCompanySubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black dark:text-white flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#0E54FF]" />
                  <span>{t("register.companyInfo")}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    placeholder={t("register.companyName")}
                    id="companyName"
                    label={t("register.companyName")}
                    registration={companyForm.register("companyName")}
                    error={companyForm.formState.errors.companyName?.message}
                  />
                  <FormInput
                    placeholder={t("register.businessId")}
                    id="businessId"
                    label={t("register.businessId")}
                    registration={companyForm.register("businessId")}
                    error={companyForm.formState.errors.businessId?.message}
                  />
                  <FormInput
                    placeholder={t("register.companyEmail")}
                    id="companyEmail"
                    type="email"
                    label={t("register.companyEmail")}
                    registration={companyForm.register("companyEmail")}
                    error={companyForm.formState.errors.companyEmail?.message}
                  />
                  <FormInput
                    placeholder={t("register.companyPhone")}
                    id="companyPhone"
                    type="tel"
                    label={t("register.companyPhone")}
                    registration={companyForm.register("companyPhone")}
                    error={companyForm.formState.errors.companyPhone?.message}
                  />
                  <div className="md:col-span-2">
                    <FormTextarea
                      placeholder={t("register.companyDescription")}
                      id="companyDescription"
                      label={t("register.companyDescription")}
                      registration={companyForm.register("companyDescription")}
                      error={
                        companyForm.formState.errors.companyDescription?.message
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  onClick={goBack}
                  variant="outline"
                  className="border-[#0E54FF] text-[#0E54FF] hover:bg-[#0E54FF]/10 px-6 py-3 rounded-full font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("register.back")}
                </Button>
                <Button
                  type="submit"
                  disabled={companyForm.formState.isSubmitting || isRegistering}
                  className="bg-[#0E54FF] hover:bg-[#0E54FF]/90 text-white px-8 py-3 rounded-full font-semibold min-w-[150px]"
                >
                  {isRegistering
                    ? t("register.registering")
                    : t("register.register")}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
