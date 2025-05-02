import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: AvailableLocale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-800 dark:text-gray-100">
      <section className="flex flex-col items-center text-center space-y-6">
        <Badge
          className="bg-[#EBF5FF] rounded-full py-2 px-6"
          aria-label={dict.company.badge}
        >
          <p className="text-lg text-[#1484FF]">{dict.company.badge}</p>
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold">{dict.company.title}</h1>
        <h2 className="text-xl md:text-2xl">{dict.company.subtitle}</h2>
        <Image
          src="/images/wow-look-at-roof.webp"
          alt={dict.company.imageAlt}
          width={1000}
          height={1000}
          className="my-12 rounded-md w-full"
          priority
        />
      </section>

      <section className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/2 space-y-4">
          <h3 className="text-2xl font-bold">{dict.company.about.heading}</h3>
          <p className="text-lg">{dict.company.about.description}</p>
        </div>

        <div
          className="md:w-1/2 space-y-8 pt-10 md:pt-0"
          aria-labelledby="cities-heading"
        >
          <h4 id="cities-heading" className="sr-only">
            {dict.company.citiesHeading}
          </h4>

          {Object.entries(dict.company.cities).map(([key, city]) => (
            <div
              key={key}
              className="border-b border-t border-gray-300 py-6 text-center"
              aria-labelledby={`city-${key}`}
            >
              <h5 id={`city-${key}`} className="text-4xl font-extrabold">
                {city.name}
              </h5>
              <p className="text-lg">{city.population}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
