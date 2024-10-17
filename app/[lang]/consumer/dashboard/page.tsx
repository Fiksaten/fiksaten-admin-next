import { AvailableLocale, getDictionary } from "@/lib/dictionaries";
import { UserBox } from "./user-box";

import Link from "next/link";
interface DashboardCardProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, href, children }) => {
  return (
    <Link href={href} className="block">
      <div className="border rounded-lg p-6 hover:shadow-md transition-shadow text-black">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{children}</p>
      </div>
    </Link>
  );
};

export default async function Page({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang as AvailableLocale);
  return (
    <div className="space-y-6 px-24">
      <UserBox />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Omat tiedot" href={`/${lang}/consumer/dashboard/settings`}>
          Tarkastele ja päivitä henkilökohtaisia tietojasi
        </DashboardCard>
        <DashboardCard title="Työpyynnöt" href={`/${lang}/consumer/dashboard/orders`}>
          Hallinnoi ja seuraa työpyyntöjäsi
        </DashboardCard>
      </div>
    </div>
  );
}
