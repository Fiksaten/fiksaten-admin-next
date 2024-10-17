import { Footer, Navigation, PromotionHeader } from "@/components/lander";
import ContactButtons from "./ContactButtons";
import MediaContact from "./MediaContact";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page() {
  const dict = await getDictionary('fi');
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <PromotionHeader dict={dict} />
        <Navigation dict={dict} />
      </header>

      <main className="flex-grow xl:px-24 lg:px-0 md:px-12 bg-white">
        <ContactButtons />
        <MediaContact />
      </main>
      <Footer />
    </div>
  );
}
