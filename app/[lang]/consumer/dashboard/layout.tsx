import Navigation from "@/components/lander/Navigation";
import LiveChatWidget from "@/components/LiveChatWidget";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

export default async function ConsumerDashboard({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: AvailableLocale };
}>) {
  const dict = await getDictionary(lang);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <Navigation dict={dict} />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <LiveChatWidget />
          {children}
        </main>
      </div>
    </div>
  );
}
