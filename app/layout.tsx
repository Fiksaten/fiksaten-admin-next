import type { Metadata } from "next";
import "./globals.css";
// import PHProvider from "./providers";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import CookieBanner from "@/components/CookieBanner";
import {AvailableLocale, getDictionary} from "@/lib/dictionaries";
import { Inter } from "next/font/google";
import {Footer, Navigation, PromotionHeader} from "@/components/lander";
// import PostHogPageView from "@/app/ClientOnlyPHProvider";

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
      {/*<PHProvider>*/}
        <body className={`bg-white text-black ${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-white shadow-sm">
            <PromotionHeader dict={dict}/>
            <Navigation dict={dict}/>
          </header>
          <CookieBanner/>
            <main className="flex-grow xl:px-24 lg:px-0 md:px-12 bg-white">
              <Toaster/>
              {children}
            </main>
          <Footer dict={dict}/>
        </div>
        </body>
      {/*</PHProvider> */}
    </AuthProvider>
    </html>
);
}
