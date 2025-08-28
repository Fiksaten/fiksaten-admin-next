import { ThemeProvider } from "@/app/lib/themeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <AuthProvider>
          <ThemeProvider>
            <body className={`${inter.className} antialiased`}>
              <Toaster />
              {children}
            </body>
          </ThemeProvider>
        </AuthProvider>
    </html>
  );
}
