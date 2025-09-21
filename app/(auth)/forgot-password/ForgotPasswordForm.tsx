"use client";
import { forgotPassword } from "@/app/lib/openapi-client";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type FormData = yup.InferType<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: FormData) {
    try {
      await forgotPassword({
        body: {
          email: data.email,
        },
      });

      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast({
        title: "OTP code sent",
        description: "Check your email for the OTP code to reset your password.",
      });
    } catch (err: any) {
      console.error("Failed to send reset email:", err);
      toast({
        title: "Failed to send OTP code",
        description: err?.message || "Please try again later.",
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
            Check your email
          </h2>
          <p className="text-muted-foreground">
            We&apos;ve sent an OTP code to your email address.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-blue-500 underline hover:text-blue-600"
            >
              try again
            </button>
          </p>
        </div>
        <div className="text-center space-y-3">
          <Link href={`/reset-password?email=${encodeURIComponent(submittedEmail)}`}>
            <Button className="bg-[#007bff] w-full max-w-[250px] text-white p-3 font-semibold">
              Enter OTP Code
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full max-w-[250px]">
              Back to Login
            </Button>
          </Link>
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
        />

        <div className="flex flex-col gap-4 w-full">
          <div className="text-center">
            <Button
              size="lg"
              className="bg-[#007bff] w-full max-w-[250px] text-white p-3 font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send OTP Code"}
            </Button>
          </div>
          <div className="border-solid border-t-2 justify-center flex border-gray-200">
            <div className="flex mt-4 gap-1">
              <p>Remember your password?</p>
              <Link href="/login" className="block text-center">
                <span className="text-blue-500 underline">Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
