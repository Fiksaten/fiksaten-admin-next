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
import { getDictionary } from "@/lib/dictionaries";

export default async function Page() {
  const dict = await getDictionary('fi'); // Default to Finnish
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <PromotionHeader />
        <Navigation />
      </header>
      <h2>{dict.greeting}</h2>
      <main className="flex-grow xl:px-24 lg:px-0 md:px-12 bg-white">
        <HeroSection />
        <ContractorLogoCarousel />
        <SecondaryHero />
        <FindNearYouSection />
        <YourSupport />
        <Recomended />
        <FaqSection />
        <CallToActionDownload />
      </main>
      <Footer />
    </div>
  );
}
