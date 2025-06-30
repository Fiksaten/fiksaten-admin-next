import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "" });

  return (
    <div className="px-4 py-10 space-y-10 text-gray-800 dark:text-gray-100">
      <section className="flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">{t("company.title")}</h1>
        <h2 className="text-xl md:text-2xl">{t("company.subtitle")}</h2>
        <Image
          src="/images/wow-look-at-roof.webp"
          alt={t("company.imageAlt")}
          width={1000}
          height={1000}
          className="my-12 rounded-md w-full"
          priority
        />
      </section>

      <section className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/2 space-y-4">
          <h3 className="text-2xl font-bold">{t("company.about.heading")}</h3>
          <p className="text-lg">{t("company.about.description")}</p>
        </div>

        <div
          className="md:w-1/2 space-y-8 pt-10 md:pt-0"
          aria-labelledby="cities-heading"
        >
          <h4 id="cities-heading" className="sr-only">
            {t("company.citiesHeading")}
          </h4>

          {Object.entries(t("company.cities")).map(([key, city]) => (
            <div
              key={key}
              className="border-b border-t border-gray-300 py-6 text-center"
              aria-labelledby={`city-${key}`}
            >
              <h5 id={`city-${key}`} className="text-4xl font-extrabold">
                {city}
              </h5>
              <p className="text-lg">{city}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
