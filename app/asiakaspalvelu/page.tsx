import { Footer, Navigation, PromotionHeader } from "@/components/lander";
import ContactButtons from "./ContactButtons";
import MediaContact from "./MediaContact";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <PromotionHeader />
        <Navigation />
      </header>

      <main className="flex-grow xl:px-24 lg:px-0 md:px-12 bg-white">
        <ContactButtons />
        <MediaContact />
      </main>
      <Footer />
    </div>
  );
}
