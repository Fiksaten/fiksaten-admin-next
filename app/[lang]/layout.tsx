import { AvailableLocale } from "@/lib/dictionaries";
import PostHogPageView from "../ClientOnlyPHProvider";

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { lang: AvailableLocale };
  }>
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const {
    children
  } = props;
  
  return (
    <html lang={lang}>
      <body>
        <PostHogPageView />
        {children}
      </body>
    </html>
  );
}
