import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { GatewayProvider } from "@/components/GatewayProvider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { Footer, Navigation } from "@/components/lander";
import { ThemeProvider } from "@/app/lib/themeProvider";
import { NextIntlClientProvider } from "next-intl";

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
    params: Promise<{ locale: string }>;
  }>
) {
  const { locale } = await props.params;

  const { children } = props;

  return (
    <html lang={locale || "fi"} className={inter.className}>
      <NextIntlClientProvider>
        <AuthProvider>
          <GatewayProvider>
            <ThemeProvider>
              <body
                className={`bg-white text-black ${inter.className} antialiased`}
              >
                <div className="flex flex-col min-h-screen">
                  <header className="bg-white shadow-sm">
                    <Navigation />
                  </header>
                  <main className="w-full flex-grow justify-items-center justify-center items-center bg-white">
                    <div className="container">
                      <Toaster />
                      {children}
                    </div>
                  </main>
                  <Footer locale={locale} />
                </div>
              </body>
            </ThemeProvider>
          </GatewayProvider>
        </AuthProvider>
      </NextIntlClientProvider>
    </html>
  );
}
