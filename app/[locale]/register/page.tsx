import { getTranslations } from "next-intl/server";
import RegisterForm from "./RegisterForm";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: "consumer" | "contractor" }>;
};

export default async function Register({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "register" });

  return (
    <div className="w-full gap-4 flex flex-col py-24 px-4 items-center">
      <div className="w-full max-w-[800px] flex items-center sm:items-stretch">
        <h1 className="text-4xl text-black font-bold mb-6">
          {t("register.register")}
        </h1>
      </div>
      <div className="w-full py-4 max-w-[800px] content-center">
        <RegisterForm type={(await searchParams).type ?? "consumer"} />
      </div>
    </div>
  );
}
