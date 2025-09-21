import ResetPasswordForm from "./ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function ResetPassword({ searchParams }: ResetPasswordPageProps) {
  const searchParamsData = await searchParams;
  return (
    <div className="w-full gap-4 flex flex-col py-24 px-4 items-center">
      <div className="w-full max-w-[500px] flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Reset Password
        </h1>
        <p className="text-muted-foreground">
          Enter the OTP code sent to your email and your new password.
        </p>
      </div>
      <div className="w-full py-4 max-w-[500px] content-center">
        <ResetPasswordForm defaultEmail={searchParamsData.email} />
      </div>
    </div>
  );
}
