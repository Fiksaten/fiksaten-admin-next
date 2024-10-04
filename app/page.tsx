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

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <PromotionHeader />
        <Navigation />
      </header>

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
