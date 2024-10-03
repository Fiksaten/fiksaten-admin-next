import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, MessageCircle, Search } from "lucide-react"
import Link from "next/link"

const HeaderPromotion = () => {
  return (
    <div className="bg-[#007AFF] text-white py-2">
      <p className="text-center text-sm font-thin">
        Fiksatenin mobiilisovellus on julkaistu! Lataa nyt sovellus ja lähetä avuntarve helposti.
      </p>
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <HeaderPromotion />
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            <h1 className="text-2xl font-bold text-[#F3D416]">Fiksaten</h1>
          </Link>
          <ul className="hidden md:flex space-x-6">
            <li><Link href="/" className="text-black font-semibold hover:text-primary">Ilmoita avuntarve</Link></li>
            <li><Link href="/yrityksesta" className="text-black font-semibold hover:text-primary">Mikä on Fiksaten</Link></li>
            <li><Link href="/register" className="text-black font-semibold hover:text-primary">Liity apulaiseksi</Link></li>
            <li><Link href="/contact" className="text-black font-semibold hover:text-primary">Asiakaspalvelu</Link></li>
          </ul>
          <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="hidden md:inline-flex text-[#6B7280] font-semibold">Kirjaudu</Button>
          </Link>
          <Link href="/register">
            <Button variant="default" className="hidden bg-[#007AFF] text-white font-semibold md:inline-flex">Rekisteröidy</Button>
            </Link>
            
          <Link href="/login">
            <Button variant="outline" size="icon" className="md:hidden">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-foreground text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">Fiksatenin mobiilisovellus on julkaistu!</h1>
            <p className="text-xl mb-8">
              Sovelluksessa voit lähettää ilmoituksen tarvitsemastasi avuntarpeesta ja saat pian tarjouksia apulaisilta.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Lataa sovellus tänään ja lähetä avuntarve
            </Button>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Löydä tekijä pienille ja isommille töille</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Search className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Kilpailuta helposti</h3>
                <p>Voit kilpailuttaa pienenkin työn helposti ja nopeasti. Lähetä vain tarjouspyyntö työstäsi ja valitse sopiva tarjous apulaisilta.</p>
              </div>
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Löydä tekijä</h3>
                <p>Löydä kiinteä hintainen apulainen pieniin ja isompiin kodin askareisiin. Sovelluksen avulla saat lähetettyä tarjouspyynnön kätevästi etsimällesi työlle.</p>
              </div>
              <div className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Keskustele apulaisen kanssa</h3>
                <p>Voit keskustella apulaisen kanssa helposti ennen- ja jälkeen työn aloitusta, esimerkiksi aikataulu muutoksista.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Haluatko liittyä apulaiseksi?</h2>
            <div className="max-w-2xl mx-auto text-center">
              <p className="mb-8">
                Fiksaten tarjoaa kätevän ja helpon tavan löytää asiakkaat. Saat käyttöön kaikki työkalut ja vapauden päättää työajat. Näet reaaliaikaiset raportit tekemistä töistä ja tilityksistä.
              </p>
              <Button size="lg">Liity apulaiseksi</Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Usein kysytyt kysymykset</h2>
            <div className="max-w-2xl mx-auto text-center">
              <p className="mb-8">
                Fiksatenin mobiilisovellus julkaistaan pian. Sovelluksessa voit lähettää ilmoituksen tarvitsemastasi avuntarpeesta ja saat pian tarjouksia apulaisilta.
              </p>
              <Button variant="outline" size="lg">Usein kysyttyä</Button>
            </div>
          </div>
        </section>

        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Lataa Fiksaten mobiilisovellus</h2>
            <p className="text-xl mb-8">
              Sovellus on julkaistu 🤗 Lataa nyt 🚀<br />
              Fiksaten mobiilisovellus on nyt saatavilla AppStoresta.<br />
              Lataa sovellus nyt ja lähetä avuntarve helposti.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Lataa nyt
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Fiksaten</h3>
              <p>Löydä tekijä pienille ja isommille töille</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Linkit</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:underline">Etusivu</Link></li>
                <li><Link href="/yrityksesta" className="hover:underline">Yrityksestä</Link></li>
                <li><Link href="/liity-apulaiseksi" className="hover:underline">Liity apulaiseksi</Link></li>
                <li><Link href="/blogi" className="hover:underline">Blogi</Link></li>
                <li><Link href="/asiakaspalvelu" className="hover:underline">Asiakaspalvelu</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ota yhteyttä</h3>
              <p>info@fiksaten.fi</p>
              <p>+358 123 456 789</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Uutiskirje</h3>
              <form className="flex">
                <Input type="email" placeholder="Sähköpostiosoitteesi" className="rounded-r-none" />
                <Button type="submit" className="rounded-l-none">Tilaa</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 Fiksaten. Kaikki oikeudet pidätetään.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}