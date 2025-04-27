import ContactButtons from "./ContactButtons";
import MediaContact from "./MediaContact";
import {AvailableLocale, getDictionary} from "@/lib/dictionaries";

export default async function Page({ params: { lang } }: { params: { lang: AvailableLocale } }) {
  const dict = await getDictionary(lang);
  return (
      <>
        <ContactButtons dict={dict} />
        <MediaContact dict={dict} />
    </>
  );
}
