import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "" });
  return (
    <footer className=" w-full mx-auto container border-solid border-t-2 border-gray-200 text-black dark:text-white pb-8">
      <div className="px-12 py-4 flex flex-col justify-center">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="flex gap-2 flex-col">
            <p className="font-bold">{t("footer.company.title")}</p>
            <div className="flex gap-2 flex-col">
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.company.aboutUs")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.company.faq")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.company.privacy")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.company.team")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.company.recruiment")}
              </Link>
            </div>
          </div>
          <div className="flex gap-2 flex-col">
            <p className="font-bold">{t("footer.consumers.title")}</p>
            <div className="flex gap-2 flex-col">
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.consumers.howItWorks")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.consumers.request")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.consumers.blog")}
              </Link>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">{t("footer.companies.title")}</p>
            <div className="flex flex-col">
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.companies.join")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.companies.info")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.companies.terms")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.companies.support")}
              </Link>
            </div>
          </div>
          <div className="flex gap-2 flex-col">
            <div className="flex flex-col">
              <p className="font-bold">{t("footer.download.title")}</p>
              <p>{t("footer.download.subtitle")}</p>
            </div>
            <div></div>
          </div>
        </div>
        <div className="border-gray-200 border-solid border-2 w-full max-w-[90%] my-6 h-1 self-center" />
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex flex-col gap-4 w-full">
            <p className="text-2xl font-bold text-[#0E54FF]">
              {t("footer.bottom.logo")}
            </p>
            <div className="flex gap-4 w-full">
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.bottom.privacy")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.bottom.terms")}
              </Link>
              <Link href="/tietosuoja" className="hover:underline">
                {t("footer.bottom.cookies")}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="h-9 w-9 bg-blue-500">S</p>
            <p className="h-9 w-9 bg-blue-500">S</p>
            <p className="h-9 w-9 bg-blue-500">S</p>
            <p className="h-9 w-9 bg-blue-500">S</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
