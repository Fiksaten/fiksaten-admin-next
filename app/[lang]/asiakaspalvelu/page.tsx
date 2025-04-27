import ContactButtons from "./ContactButtons";
import MediaContact from "./MediaContact";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

type PageProps = {
  params: Promise<{ lang: AvailableLocale }>;
};

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <>
      <ContactButtons dict={dict} />
      <MediaContact dict={dict} />
    </>
  );
}
