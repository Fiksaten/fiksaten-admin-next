import type { Metadata } from "next";
import "./globals.css";
import PHProvider from "./providers";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import CookieBanner from "@/components/CookieBanner";
import { AvailableLocale } from "@/lib/dictionaries";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiksaten",
  description: "Fiksaten",
};

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: AvailableLocale };
}>) {
  return (
    <html lang={lang || "fi"} className={inter.className}>
      <PHProvider>
        <body className={`bg-white text-black ${inter.className} antialiased`}>
          <CookieBanner />
          <PostHogPageView />
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </body>
      </PHProvider>
    </html>
  );
}
