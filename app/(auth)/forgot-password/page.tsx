import ForgotPasswordForm from "./ForgotPasswordForm";

export default async function ForgotPassword() {
  return (
    <div className="w-full gap-4 flex flex-col py-24 px-4 items-center">
      <div className="w-full max-w-[500px] flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Forgot Password
        </h1>
        <p className="text-muted-foreground">
          Enter your email address and we&apos;ll send you an OTP code to reset your password.
        </p>
      </div>
      <div className="w-full py-4 max-w-[500px] content-center">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
