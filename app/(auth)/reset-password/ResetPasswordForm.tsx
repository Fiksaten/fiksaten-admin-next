"use client";
import { resetPasswordWithOtp } from "@/app/lib/openapi-client";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const resetPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  otpCode: yup
    .string()
    .length(6, "OTP code must be 6 digits")
    .required("OTP code is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z]).{8,}$/,
      "Password must contain at least one number, one special character, one uppercase letter, and one lowercase letter"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});

type FormData = yup.InferType<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  defaultEmail?: string;
}

export default function ResetPasswordForm({ defaultEmail }: ResetPasswordFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: defaultEmail || "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      await resetPasswordWithOtp({
        body: {
          email: data.email,
          otpCode: data.otpCode,
          password: data.password,
        },
      });

      setIsSubmitted(true);
      toast({
        title: "Password updated successfully",
        description: "Your password has been updated. You can now log in with your new password.",
      });
    } catch (err: any) {
      console.error("Failed to reset password:", err);
      toast({
        title: "Failed to reset password",
        description: err?.message || "Please try again or request a new OTP code.",
        variant: "destructive",
      });
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full flex flex-col justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="text-green-600 dark:text-green-400">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Password Updated Successfully
          </h2>
          <p className="text-muted-foreground">
            Your password has been updated. You can now log in with your new password.
          </p>
        </div>
        <div className="text-center">
          <Button
            onClick={() => router.push("/login")}
            className="bg-[#007bff] w-full max-w-[250px] text-white p-3 font-semibold"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          placeholder="Enter your email address"
          id="email"
          type="email"
          label="Email Address"
          registration={register("email")}
          error={errors.email?.message}
          disabled={!!defaultEmail}
        />

        <FormInput
          placeholder="Enter 6-digit OTP code"
          id="otpCode"
          type="text"
          label="OTP Code"
          registration={register("otpCode")}
          error={errors.otpCode?.message}
          maxLength={6}
        />

        <FormInput
          placeholder="Enter new password"
          id="password"
          type="password"
          label="New Password"
          registration={register("password")}
          error={errors.password?.message}
        />

        <FormInput
          placeholder="Confirm new password"
          id="confirmPassword"
          type="password"
          label="Confirm New Password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="flex flex-col gap-4 w-full">
          <div className="text-center">
            <Button
              size="lg"
              className="bg-[#007bff] w-full max-w-[250px] text-white p-3 font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
