import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { GatewayProvider } from "@/components/GatewayProvider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
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
              <body className={`${inter.className} antialiased`}>
                <Toaster />
                {children}
              </body>
            </ThemeProvider>
          </GatewayProvider>
        </AuthProvider>
      </NextIntlClientProvider>
    </html>
  );
}
