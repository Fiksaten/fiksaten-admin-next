import { Footer, Navigation, PromotionHeader } from "@/components/lander";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen ">
      <header className="bg-white shadow-sm">
        <PromotionHeader />
        <Navigation />
      </header>
    <div className="flex flex-col px-32 py-12 ">
      <h1 className="text-7xl  font-bold text-center">
        Tietosuoja- ja evästekäytännöt
      </h1>
      <p className="text-center mt-12">11.7.2024 — Fiksaten Group Oy</p>
      <h1 className="text-6xl font-bold mt-24 mb-12">
        Fiksaten henkilötietojesi rekisterinpitäjänä
      </h1>
      <p className="mt-4">
        Fiksatenin liiketoiminnan keskeisenä tarkoituksena on pyrkiä
        tuotteillaan ja palveluillaan tarjoamaan voimaannuttavia kokemuksia
        asiakkailleen. Käytämme dataa tämän tarkoituksen täyttämiseksi eri
        sivustoillamme, tuotteissamme ja palveluissamme Fiksaten Suomen
        valvonnassa ja vastuulla. Jotta käyttäjämme luottaisivat meihin ja
        palveluihimme nyt ja jatkossa, on meille ensiarvoisen tärkeää, että
        heidän henkilötietojaan käsitellään turvallisella tavalla.
      </p>
      <h1 className="text-6xl font-bold mt-24">Tietosuojakäytäntö</h1>
      <p className="mt-4">
        Tämä tietosuojakäytäntö koskee Fiksaten.fi-verkkosivua,
        mobiilisovellusta ja sen käyttäjiä. Fiksaten on mobiilisovellus, jonka
        avulla kuluttajat voivat löytää paikallisen urakoitsijan helposti ja
        nopeasti. Käsittelemme henkilötietoja noudattaen voimassa olevaa
        tietosuojalainsäädäntöä.
      </p>
      <h1 className="text-6xl font-bold mt-24">1. Kerättävät tiedot</h1>
      <p className="mt-4">Keräämme seuraavia tietoja käyttäjiltämme:</p>
      <ul>
        <li>
          <p>
            {" "}
            <span className="font-bold">Henkilötiedot:</span> nimi, osoite,
            puhelinnumero, sähköpostiosoite.
          </p>
        </li>
        <li>
          <p>
            {" "}
            <span className="font-bold">Sijaintitiedot:</span> käyttäjän
            laitteesta kerätyt sijaintitiedot palvelun toiminnan
            mahdollistamiseksi.
          </p>
        </li>
        <li>
          <p>
            {" "}
            <span className="font-bold">Maksutiedot:</span> maksutietoja
            käsitellään turvallisesti kolmannen osapuolen maksupalveluiden
            kautta.
          </p>
        </li>
        <li>
          <p>
            {" "}
            <span className="font-bold">
              Sovelluksen käyttöön liittyvät tiedot:
            </span>{" "}
            laitteiden tunnisteet, IP-osoitteet, käyttöjärjestelmätiedot.
          </p>
        </li>
      </ul>
      <h1 className="text-6xl font-bold mt-24">2. Tietojen käyttö</h1>
      <p className="mt-4">
        Käytämme kerättyjä tietoja seuraaviin tarkoituksiin:
      </p>
      <ul>
        <li>Palvelun tarjoaminen ja käyttäjäkokemuksen parantaminen.</li>
        <li>
          Käyttäjien ja urakoitsijoiden välisen yhteydenpidon mahdollistaminen.
        </li>
        <li>Maksutapahtumien käsittely.</li>
        <li>
          Markkinointi ja viestintä käyttäjien suuntaan, heidän
          suostumuksellaan.
        </li>
        <li>Analytiikka ja tilastolliset tarkoitukset.</li>
      </ul>
      <h1 className="text-6xl font-bold mt-24">3. Tietojen säilytys</h1>
      <p className="mt-4">
        Säilytämme henkilötietoja niin kauan kuin se on tarpeen palvelun
        tarjoamisen ja lakisääteisten velvoitteiden täyttämiseksi. Kun tietoja
        ei enää tarvita, ne poistetaan asianmukaisesti.
      </p>
      <h1 className="text-6xl font-bold mt-24">4. Tietojen luovuttaminen</h1>
      <p>
        Emme luovuta käyttäjien henkilötietoja kolmansille osapuolille, paitsi
        seuraavissa tapauksissa:
      </p>
      <ul>
        <li>Jos käyttäjä antaa meille suostumuksen.</li>
        <li>
          Jos tämä on vaadittu lakisääteisten velvoitteiden täyttämiseksi.
        </li>
        <li>
          Palvelun toimittamiseksi tarvittaville palveluntarjoajille (esim.
          maksupalvelut).
        </li>
      </ul>
      <h1 className="text-6xl font-bold mt-24">5. Käyttäjän oikeudet</h1>
      <p className="mt-4">Käyttäjillä on seuraavat oikeudet:</p>
      <ul>
        <li>Oikeus tarkistaa itseään koskevat tiedot.</li>
        <li>Oikeus tietojen oikaisemiseen tai poistamiseen.</li>
        <li>Oikeus käsittelyn rajoittamiseen.</li>
        <li>Oikeus vastustaa tietojen käsittelyä.</li>
        <li>Oikeus tietojen siirrettävyyteen.</li>
      </ul>

      <p>
        Yhteydenotot tietosuoja-asioissa voi osoittaa sähköpostitse osoitteeseen
        asiakaspalvelu@fiksaten.fi.
      </p>

      <h1 className="text-6xl font-bold mt-24">Evästekäytäntö</h1>
      <h3>Fiksaten.fi evästekäytäntö</h3>

      <p>
        Tämä evästekäytäntö selittää, miten Fiksaten.fi käyttää evästeitä ja
        vastaavia teknologioita käyttäjien laitteilla. Käyttämällä palveluamme
        hyväksyt evästeiden käytön tämän käytännön mukaisesti.
      </p>

      <h1 className="text-6xl font-bold mt-24">1. Mitä evästeet ovat?</h1>
      <p>
        Evästeet ovat pieniä tekstitiedostoja, jotka tallennetaan käyttäjän
        laitteelle heidän vieraillessaan verkkosivuilla. Evästeet voivat olla
        väliaikaisia (istuntokohtaisia) tai pysyviä.
      </p>

      <h1 className="text-6xl font-bold mt-24">2. Evästeiden käyttö</h1>
      <p>Käytämme evästeitä seuraaviin tarkoituksiin:</p>

      <p>
        Toiminnalliset evästeet: Nämä evästeet ovat välttämättömiä palvelun
        toiminnan kannalta. Ne mahdollistavat sivuston perustoiminnot, kuten
        navigoinnin ja lomakkeiden täyttämisen.
      </p>
      <p>
        Analytiikkaevästeet: Nämä evästeet keräävät tietoa siitä, miten
        käyttäjät käyttävät palveluamme. Käytämme tätä tietoa parantaaksemme
        palvelun toimivuutta.
      </p>
      <p>
        Markkinointievästeet: Nämä evästeet keräävät tietoa käyttäjän
        selaustottumuksista, jotta voimme tarjota kohdennettua mainontaa.
      </p>
      <h1 className="text-6xl font-bold mt-24">3. Evästeiden hallinta</h1>
      <p>
        Käyttäjät voivat hallita evästeasetuksiaan selaimensa asetuksista.
        Huomaa, että evästeiden poistaminen tai niiden käytön estäminen voi
        vaikuttaa palvelun toimivuuteen.
      </p>

      <h1 className="text-6xl font-bold mt-24">
        4. Kolmannen osapuolen evästeet
      </h1>
      <p>
        Sovelluksemme voi käyttää kolmansien osapuolten evästeitä, kuten
        analytiikka- ja mainontapalveluja tarjoavia evästeitä. Näiden evästeiden
        käyttöön sovelletaan kyseisten kolmansien osapuolten omia
        evästekäytäntöjä.
      </p>

      <p>
        Yhteydenotot evästeisiin liittyvissä asioissa voi osoittaa sähköpostitse
        osoitteeseen asiakaspalvelu@fiksaten.fi
      </p>

      <p>
        Nämä käytännöt voivat muuttua aika ajoin. Suosittelemme käyttäjiä
        tarkistamaan nämä sivut säännöllisesti pysyäkseen ajan tasalla
        mahdollisista muutoksista.
      </p>
    </div>
    <Footer />
    </div>
  );
}
