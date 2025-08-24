import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/app/lib/themeProvider";
import PostHogProvider from "@/components/PostHogProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiksaten",
  description: "Fiksaten",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={"fi"} className={inter.className}>
      <PostHogProvider>
        <AuthProvider>
          <ThemeProvider>
            <body className={`${inter.className} antialiased`}>
              <Toaster />
              {children}
            </body>
          </ThemeProvider>
        </AuthProvider>
      </PostHogProvider>
    </html>
  );
}
