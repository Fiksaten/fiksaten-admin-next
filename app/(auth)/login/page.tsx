import LoginForm from "./LoginForm";

export default async function Login() {

  return (
    <div className="w-full gap-4 flex flex-col py-24 px-4 items-center">
      <div className="w-full max-w-[500px] flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Login
        </h1>
        <p className="text-muted-foreground">Login to your account</p>
      </div>
      <div className="w-full py-4 max-w-[500px] content-center">
        <LoginForm />
      </div>
    </div>
  );
}
