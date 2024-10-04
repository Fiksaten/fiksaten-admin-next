"use client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define the validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      toast({
        title: "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full flex flex-col justify-center space-y-6">
      <h2 className="text-2xl font-bold text-black">Kirjaudu sisään</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-black font-semibold">
            Sähköposti
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Sähköposti"
            {...register("email")}
            className="mt-1"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password" className="text-black font-semibold">
            Salasana
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="Salasana"
            {...register("password")}
            className="mt-1"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <Button
          className="bg-[#007bff] w-full text-white p-3 font-semibold"
          type="submit"
          disabled={isSubmitting}
        >
          Kirjaudu sisään
        </Button>
        <Link href="/forgot-password" className="block text-center">
          <span className="text-blue-500 underline">Unohtuiko salasanasi?</span>
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
