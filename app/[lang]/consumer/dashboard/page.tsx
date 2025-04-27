import { AvailableLocale, getDictionary } from "@/lib/dictionaries";
import { UserBox } from "./user-box";
import { DashboardCard } from "./dashboard-card";

type PageProps = {
  params: Promise<{ lang: AvailableLocale }>;
};

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="space-y-6 px-24">
      <UserBox />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Omat tiedot"
          href={`/${lang}/consumer/dashboard/settings`}
        >
          Tarkastele ja päivitä henkilökohtaisia tietojasi{" "}
          {dict.lander.callToActionDownload.description}
        </DashboardCard>
        <DashboardCard
          title="Työpyynnöt"
          href={`/${lang}/consumer/dashboard/orders`}
        >
          Hallinnoi ja seuraa työpyyntöjäsi
        </DashboardCard>
      </div>
    </div>
  );
}
