import { AvailableLocale, getDictionary } from "@/lib/dictionaries";
import { UserBox } from "./user-box";
import { DashboardCard } from "./dashboard-card";

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang as AvailableLocale);
  return (
    <div className="space-y-6 px-24">
      <UserBox />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Omat tiedot" href={`/${lang}/consumer/dashboard/settings`}>
          Tarkastele ja päivitä henkilökohtaisia tietojasi {dict.lander.callToActionDownload.description}
        </DashboardCard>
        <DashboardCard title="Työpyynnöt" href={`/${lang}/consumer/dashboard/orders`}>
          Hallinnoi ja seuraa työpyyntöjäsi
        </DashboardCard>
      </div>
    </div>
  );
}
