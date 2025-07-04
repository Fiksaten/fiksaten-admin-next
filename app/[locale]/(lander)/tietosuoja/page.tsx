import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "" });

  return (
    <div className="max-w-4xl px-4 py-10 space-y-10 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold">{t("privacy.mainTitle")}</h1>
      <p className="text-sm italic">{t("privacy.lastUpdated")}</p>

      <section>
        <h2 className="text-2xl font-semibold">
          {t("privacy.dataControllerTitle")}
        </h2>
        <p className="mt-2">{t("privacy.dataControllerDescription")}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">
          {t("privacy.privacyPolicyTitle")}
        </h2>
        <p className="mt-2">{t("privacy.privacyPolicyDescription")}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">{t("privacy.section1Title")}</h3>
        <p className="mt-2">{t("privacy.section1Intro")}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{t("privacy.section1DataPoints.personal")}</li>
          <li>{t("privacy.section1DataPoints.location")}</li>
          <li>{t("privacy.section1DataPoints.payment")}</li>
          <li>{t("privacy.section1DataPoints.usage")}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold">{t("privacy.section2Title")}</h3>
        <p className="mt-2">{t("privacy.section2Intro")}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{t("privacy.section2Purposes.service")}</li>
          <li>{t("privacy.section2Purposes.communication")}</li>
          <li>{t("privacy.section2Purposes.payments")}</li>
          <li>{t("privacy.section2Purposes.marketing")}</li>
          <li>{t("privacy.section2Purposes.analytics")}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold">{t("privacy.section3Title")}</h3>
        <p className="mt-2">{t("privacy.section3Content")}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">{t("privacy.section4Title")}</h3>
        <p className="mt-2">{t("privacy.section4Intro")}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{t("privacy.section4Conditions.consent")}</li>
          <li>{t("privacy.section4Conditions.legal")}</li>
          <li>{t("privacy.section4Conditions.providers")}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("privacy.section5Title")}</h2>
        <p className="mt-2">{t("privacy.section5Intro")}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{t("privacy.section5Rights.access")}</li>
          <li>{t("privacy.section5Rights.correction")}</li>
          <li>{t("privacy.section5Rights.restriction")}</li>
          <li>{t("privacy.section5Rights.objection")}</li>
          <li>{t("privacy.section5Rights.portability")}</li>
        </ul>
        <p className="mt-4">{t("privacy.contactInfo")}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">
          {t("privacy.cookiePolicyTitle")}
        </h2>
        <p className="mt-2">{t("privacy.cookiePolicyIntro")}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">
          {t("privacy.cookieSection1Title")}
        </h3>
        <p className="mt-2">{t("privacy.cookieSection1Content")}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">
          {t("privacy.cookieSection2Title")}
        </h3>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{t("privacy.cookieSection2Functional")}</li>
          <li>{t("privacy.cookieSection2Analytics")}</li>
          <li>{t("privacy.cookieSection2Marketing")}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold">
          {t("privacy.cookieSection3Title")}
        </h3>
        <p className="mt-2">{t("privacy.cookieSection3Content")}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">
          {t("privacy.cookieSection4Title")}
        </h3>
        <p className="mt-2">{t("privacy.cookieSection4Content")}</p>
      </section>

      <p>{t("privacy.cookieContact")}</p>
      <p className="text-sm italic mt-4">{t("privacy.cookieChanges")}</p>
    </div>
  );
}
