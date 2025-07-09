import {
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

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow xl:px-24 lg:px-0 md:px-12 bg-white">
        <HeroSection />
        <ContractorLogoCarousel locale={locale} />
        <SecondaryHero />
        <FindNearYouSection />
        <YourSupport />
        <Recomended />
        <FaqSection />
        <CallToActionDownload />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
