import { AvailableLocale, getDictionary } from "@/lib/dictionaries";
import { Footer, Navigation, PromotionHeader } from "@/components/lander";
import PostHogPageView from "@/app/ClientOnlyPHProvider";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: AvailableLocale }>;
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <div className="flex flex-col min-h-screen">
          <header className="bg-white shadow-sm">
            <PromotionHeader dict={dict} />
            <Navigation dict={dict} />
          </header>
          <main className="flex-grow xl:px-24 lg:px-0 md:px-12 bg-white">
            <PostHogPageView />
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
