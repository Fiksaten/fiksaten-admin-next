import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { GatewayProvider } from "@/components/GatewayProvider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { Footer, Navigation } from "@/components/lander";
import { ThemeProvider } from "@/app/lib/themeProvider";
import PostHogProvider from "@/components/PostHogProvider";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiksaten",
  description: "Fiksaten",
};

function ConditionalNavigation({ pathname }: { pathname: string }) {
  // Don't show main navigation for admin routes
  const isAdminRoute = pathname.includes("/admin/dashboard");

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="">
      <Navigation />
    </header>
  );
}

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
        <PostHogProvider>
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
        </PostHogProvider>
      </NextIntlClientProvider>
    </html>
  );
}
