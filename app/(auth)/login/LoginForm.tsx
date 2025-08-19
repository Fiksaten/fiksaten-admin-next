"use client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInput } from "@/components/FormInput";

const useLoginSchema = () => {
  return yup.object().shape({
    email: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required"),
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof loginSchema>;

export default function LoginForm() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(useLoginSchema()),
    mode: "onBlur",
  });

  async function onSubmit(data: FormData) {
    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error("Failed:", err);
      toast({
        title: "Login failed",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full flex flex-col justify-center space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          placeholder="Email"
          id="email"
          type="email"
          label="Email"
          registration={register("email")}
          error={errors.email?.message}
        />

        <FormInput
          placeholder="Password"
          id="password"
          type="password"
          label="Password"
          registration={register("password")}
          error={errors.password?.message}
        />
        <div className="flex flex-col gap-4 w-full">
          <div className="justify-items-end">
            <Link href="/forgot-password" className="block text-center">
              <span className="text-blue-500 underline">
                Unohtuiko salasanasi?
              </span>
            </Link>
          </div>
          <div className="text-center">
            <Button
              size="lg"
              className="bg-[#007bff] w-full max-w-[250px] text-white p-3 font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              Login
            </Button>
          </div>
          <div className="border-solid border-t-2 justify-center flex border-gray-200">
            <div className="flex mt-4 gap-1">
              <p>Don&apos;t have an account?</p>
              <Link href="/register" className="block text-center">
                <span className="text-blue-500 underline">
                  Register
                </span>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
