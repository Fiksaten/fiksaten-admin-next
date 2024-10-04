import { Navigation, PromotionHeader, Footer } from "@/components/lander";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <PromotionHeader />
        <Navigation />
      </header>

      <main className="flex-grow xl:px-24 lg:px-0 md:px-12 bg-white">
        <section className="container mx-auto flex-col px-4 pb-4 flex items-center justify-center pt-24">
          <Badge className="bg-[#EBF5FF] rounded-full py-2 px-6">
            <p className="text-lg text-[#1484FF]">Mikä on Fiksaten?</p>
          </Badge>
          <h1 className="text-8xl text-center font-bold mt-12">
            Fiksaten, uuden ajan sovellus kodin askareisiin
          </h1>
          <h3 className="text-2xl text-center mt-12">
            Halusimme helpottaa kodin palveluiden tilaamista kaikille.
          </h3>
          <Image
            src="/images/wow-look-at-roof.webp"
            alt="Wow look at roof"
            width={1000}
            height={1000}
            className="my-12 rounded-md w-full"
          />
        </section>
        <section className="container mx-auto flex-row px-4 pb-4 flex pt-24">
          <div className="flex flex-col justify-start w-1/2 mx-4">
            <h1 className="text-3xl font-bold my-4">
              Me Fiksatenilla halusimme muuttaa tapaa, jolla pientenkin arki
              askareiden tekijän voi löytää uudella ja helpolla tavalla.
            </h1>
            <p className="text-xl">
            Fiksaten on mobiilisovellus, joka yhdistää ensisijaisesti kodinomistajat, vuokralaiset ja kiinteistösijoittajat alustan valittuihin urakoitsijoihin kiinteällä hinnalla ja tehokkaalla tavalla. Tämä tekee kodin palveluiden tilaamisesta ja kodin kunnostusprojekteista entistä helpompaa ja läpinäkyvämpää kummallekin osapuolelle.
            </p>
          </div>
          <div className="flex flex-col items-center justify-start w-1/2 "> 
            <div className="border-b w-full text-center border-t border-gray-300 py-8">
                <h4 className="font-extrabold text-8xl">Helsinki</h4>
                <p className="text-2xl">Asukkaita yhteensä 675 952</p>
            </div>
            <div className="border-b border-gray-300 w-full text-center py-8">
                <h4 className="font-extrabold text-8xl">Espoo</h4>
                <p className="text-2xl">Asukkaita yhteensä 314 150</p>
            </div>
            <div className="border-b border-gray-300 py-8 w-full text-center">
                <h4 className="font-extrabold text-8xl">Vantaa</h4>
                <p className="text-2xl">Asukkaita yhteensä 251 235</p>
            </div>
            
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
