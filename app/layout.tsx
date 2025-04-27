import type { Metadata } from "next";
import "./globals.css";
import PHProvider from "./providers";
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

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: AvailableLocale }>;
  }>
) {
  const params = await props.params;

  const { lang } = params;

  const { children } = props;

  return (
    <html lang={lang || "fi"} className={inter.className}>
      <PHProvider>
        <body className={`bg-white text-black ${inter.className} antialiased`}>
          <CookieBanner />
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </body>
      </PHProvider>
    </html>
  );
}
