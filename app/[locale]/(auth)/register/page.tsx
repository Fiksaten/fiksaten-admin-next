import { getTranslations } from "next-intl/server";
import RegisterForm from "./RegisterForm";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: "consumer" | "contractor" }>;
};

export default async function Register({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "" });

  return (
    <div className="min-h-screen bg-[#EDEEF1] flex flex-col justify-center py-12 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <RegisterForm type={(await searchParams).type ?? "consumer"} />
      </div>
    </div>
  );
}
