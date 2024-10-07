import { AvailableLocale } from "@/lib/dictionaries";

export default async function RootLayout({
  children,
  params: { lang }
}: Readonly<{
  children: React.ReactNode;
  params: { lang: AvailableLocale };
}>) {
  return (
    <html lang={lang}>
      
        <body>
            {children}
        </body>
    </html>
  );
}
