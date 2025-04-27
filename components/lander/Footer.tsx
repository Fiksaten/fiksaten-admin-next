import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#007AFF] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Fiksaten</h3>
            <p>Löydä kodin apulainen helposti ja nopeasti.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Linkit</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline">
                  Etusivu
                </Link>
              </li>
              <li>
                <Link href="/yrityksesta" className="hover:underline">
                  Yrityksestä
                </Link>
              </li>
              <li>
                <Link href="/liity-apulaiseksi" className="hover:underline">
                  Liity apulaiseksi
                </Link>
              </li>
              <li>
                <Link href="/blogi" className="hover:underline">
                  Blogi
                </Link>
              </li>
              <li>
                <Link href="/asiakaspalvelu" className="hover:underline">
                  Asiakaspalvelu
                </Link>
              </li>
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
              <Input
                type="email"
                placeholder="Sähköpostiosoitteesi"
                className="rounded-r-none text-black bg-white"
              />
              <Button type="submit" className="rounded-l-none">
                Tilaa
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center flex flex-row justify-center gap-4">
          <p>&copy; 2024 Fiksaten Group Oy. Kaikki oikeudet pidätetään.</p>
          <Link
            href="/tietosuoja"
            className="hover:underline border-r border-l border-white px-6"
          >
            Tietosuoja
          </Link>
          <Link href="/kayttoehdot" className="hover:underline">
            Käyttöehdot
          </Link>
        </div>
      </div>
    </footer>
  );
}
