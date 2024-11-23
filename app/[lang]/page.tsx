import {
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
import Navigation from "@/components/lander/Navigation";
import { getDictionary, AvailableLocale } from "@/lib/dictionaries";

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const dict = await getDictionary(lang as AvailableLocale);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <PromotionHeader dict={dict} />
        <Navigation dict={dict} />
      </header>
      <main className="flex-grow bg-white px-0 md:px-12 lg:px-0 xl:px-24">
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
