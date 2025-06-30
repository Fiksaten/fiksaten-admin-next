import { UserBox } from "./user-box";
import { DashboardCard } from "./dashboard-card";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return (
    <div className="space-y-6 px-24">
      <UserBox />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Omat tiedot"
          href={`/${locale}/consumer/dashboard/settings`}
        >
          Tarkastele ja päivitä henkilökohtaisia tietojasi
        </DashboardCard>
        <DashboardCard
          title="Työpyynnöt"
          href={`/${locale}/consumer/dashboard/orders`}
        >
          Hallinnoi ja seuraa työpyyntöjäsi
        </DashboardCard>
      </div>
    </div>
  );
}
