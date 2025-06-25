import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { GatewayProvider } from "@/components/GatewayProvider";
import { Toaster } from "@/components/ui/toaster";
import CookieBanner from "@/components/CookieBanner";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";
import { Inter } from "next/font/google";
import { Footer, Navigation, PromotionHeader } from "@/components/lander";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiksaten",
  description: "Fiksaten",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { lang: AvailableLocale };
  }>
) {
  const { lang } = await props.params;

  const { children } = props;

  const dict = await getDictionary(lang);
  return (
    <html lang={lang || "fi"} className={inter.className}>
      <AuthProvider>
        <GatewayProvider>
          <body className={`bg-white text-black ${inter.className} antialiased`}>
          <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-sm">
              <Navigation dict={dict} />
            </header>
            <CookieBanner />
            <main className="w-full flex-grow justify-items-center justify-center items-center bg-white">
              <div className="container">
                <Toaster />
                {children}
              </div>
            </main>
            <Footer dict={dict} />
          </div>
          </body>
        </GatewayProvider>
      </AuthProvider>
    </html>
  );
}
