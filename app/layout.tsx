import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PHProvider from './providers'
import dynamic from 'next/dynamic'
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import CookieBanner from "@/components/CookieBanner";
import { AvailableLocale, getDictionary } from "./[lang]/dictionaries";
import LanguageSelector from "@/components/LanguageSelector";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fiksaten",
  description: "Fiksaten",
};

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

export default async function RootLayout({
  children,
  params: { lang }
}: Readonly<{
  children: React.ReactNode;
  params: { lang: AvailableLocale };
}>) {
  const dict = await getDictionary(lang);
  return (
    <html lang={lang || 'fi'}>
      <PHProvider>
      <body
        className={`bg-white text-black ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookieBanner />
        <PostHogPageView />
        <AuthProvider>
        <LanguageSelector currentLang={lang || 'fi'} />
        <Toaster />
          {children}
        </AuthProvider>
      </body>
      </PHProvider>
    </html>
  );
}
