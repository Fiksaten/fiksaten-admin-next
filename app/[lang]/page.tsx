import {
  Navigation,
  PromotionHeader,
  HeroSection,
  SecondaryHero,
  ContractorLogoCarousel,
  FindNearYouSection,
  YourSupport,
  Recomended,
  FaqSection,
  CallToActionDownload,
  Footer,
} from "@/components/lander";
import { getDictionary, AvailableLocale } from "@/lib/dictionaries";

export default async function Page({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang as AvailableLocale);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <PromotionHeader dict={dict} />
        <Navigation dict={dict} />
      </header>
      <main className="flex-grow xl:px-24 lg:px-0 md:px-12 bg-white">
        <HeroSection dict={dict} />
        <ContractorLogoCarousel dict={dict} />
        <SecondaryHero dict={dict} />
        <FindNearYouSection dict={dict} />
        <YourSupport dict={dict} />
        <Recomended dict={dict} />
        <FaqSection dict={dict} />
        <CallToActionDownload dict={dict} />
      </main>
      <Footer />
    </div>
  );
}
