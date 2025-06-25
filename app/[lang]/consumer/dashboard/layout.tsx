import { getaccessToken } from "@/app/lib/actions";
import Navigation from "@/components/lander/Navigation";
import LiveChatWidget from "@/components/LiveChatWidget";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: AvailableLocale }>;
};

export default async function ConsumerDashboard({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const accessToken = await getaccessToken();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <Navigation dict={dict} />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <LiveChatWidget accessToken={accessToken!} />
          {children}
        </main>
      </div>
    </div>
  );
}
