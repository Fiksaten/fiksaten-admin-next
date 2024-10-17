import { AvailableLocale } from "@/lib/dictionaries";

export default async function RootLayout({
  children,
  params: { lang }
}: Readonly<{
  children: React.ReactNode;
  params: { lang: AvailableLocale };
}>) {
  console.log("sefsef")
  return (
    <html lang={lang}>
      <body>
        {children}
      </body>
    </html>
  );
}
