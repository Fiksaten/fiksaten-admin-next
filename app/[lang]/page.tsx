import {
  HeroSection,
  SecondaryHero,
  ContractorLogoCarousel,
  FindNearYouSection,
  YourSupport,
  Recomended,
  FaqSection,
  CallToActionDownload,
} from "@/components/lander";
import { getDictionary, AvailableLocale } from "@/lib/dictionaries";

export default async function Page({ params: { lang } }: { params: { lang: AvailableLocale } }) {
  const dict = await getDictionary(lang);
  return (
      <>
        <HeroSection dict={dict} />
        <ContractorLogoCarousel dict={dict} />
        <SecondaryHero dict={dict} />
        <FindNearYouSection dict={dict} />
        <YourSupport dict={dict} />
        <Recomended dict={dict} />
        <FaqSection dict={dict} />
        <CallToActionDownload dict={dict} />
  </>
  );
}
