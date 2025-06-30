import { getTranslations } from "next-intl/server";
import LoginForm from "./LoginForm";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Login({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "" });
  return (
    <div className="w-full gap-4 flex flex-col py-24 px-4 items-center">
      <div className="w-full max-w-[500px] flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-black">{t("login.title")}</h1>
        <p className="text-muted-foreground">{t("login.titleSecondary")}</p>
      </div>
      <div className="w-full py-4 max-w-[500px] content-center">
        <LoginForm />
      </div>
    </div>
  );
}
