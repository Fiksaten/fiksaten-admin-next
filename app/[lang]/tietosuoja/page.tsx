import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: AvailableLocale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="max-w-4xl px-4 py-10 space-y-10 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-bold">{dict.privacy.mainTitle}</h1>
      <p className="text-sm italic">{dict.privacy.lastUpdated}</p>

      <section>
        <h2 className="text-2xl font-semibold">
          {dict.privacy.dataControllerTitle}
        </h2>
        <p className="mt-2">{dict.privacy.dataControllerDescription}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">
          {dict.privacy.privacyPolicyTitle}
        </h2>
        <p className="mt-2">{dict.privacy.privacyPolicyDescription}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">{dict.privacy.section1Title}</h3>
        <p className="mt-2">{dict.privacy.section1Intro}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{dict.privacy.section1DataPoints.personal}</li>
          <li>{dict.privacy.section1DataPoints.location}</li>
          <li>{dict.privacy.section1DataPoints.payment}</li>
          <li>{dict.privacy.section1DataPoints.usage}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold">{dict.privacy.section2Title}</h3>
        <p className="mt-2">{dict.privacy.section2Intro}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{dict.privacy.section2Purposes.service}</li>
          <li>{dict.privacy.section2Purposes.communication}</li>
          <li>{dict.privacy.section2Purposes.payments}</li>
          <li>{dict.privacy.section2Purposes.marketing}</li>
          <li>{dict.privacy.section2Purposes.analytics}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold">{dict.privacy.section3Title}</h3>
        <p className="mt-2">{dict.privacy.section3Content}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">{dict.privacy.section4Title}</h3>
        <p className="mt-2">{dict.privacy.section4Intro}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{dict.privacy.section4Conditions.consent}</li>
          <li>{dict.privacy.section4Conditions.legal}</li>
          <li>{dict.privacy.section4Conditions.providers}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{dict.privacy.section5Title}</h2>
        <p className="mt-2">{dict.privacy.section5Intro}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{dict.privacy.section5Rights.access}</li>
          <li>{dict.privacy.section5Rights.correction}</li>
          <li>{dict.privacy.section5Rights.restriction}</li>
          <li>{dict.privacy.section5Rights.objection}</li>
          <li>{dict.privacy.section5Rights.portability}</li>
        </ul>
        <p className="mt-4">{dict.privacy.contactInfo}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">
          {dict.privacy.cookiePolicyTitle}
        </h2>
        <p className="mt-2">{dict.privacy.cookiePolicyIntro}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">
          {dict.privacy.cookieSection1Title}
        </h3>
        <p className="mt-2">{dict.privacy.cookieSection1Content}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">
          {dict.privacy.cookieSection2Title}
        </h3>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{dict.privacy.cookieSection2Functional}</li>
          <li>{dict.privacy.cookieSection2Analytics}</li>
          <li>{dict.privacy.cookieSection2Marketing}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold">
          {dict.privacy.cookieSection3Title}
        </h3>
        <p className="mt-2">{dict.privacy.cookieSection3Content}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold">
          {dict.privacy.cookieSection4Title}
        </h3>
        <p className="mt-2">{dict.privacy.cookieSection4Content}</p>
      </section>

      <p>{dict.privacy.cookieContact}</p>
      <p className="text-sm italic mt-4">{dict.privacy.cookieChanges}</p>
    </div>
  );
}
