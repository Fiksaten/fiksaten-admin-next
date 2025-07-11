import Image from "next/image";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { getTranslations } from "next-intl/server";

const logos = [
  { src: "/images/logos/cliifax.png", alt: "Company logo 1" },
  { src: "/images/logos/eld.png", alt: "Company logo 2" },
  { src: "/images/logos/jks.png", alt: "Company logo 3" },
  { src: "/images/logos/jtk-sahko.png", alt: "Company logo 4" },
  { src: "/images/logos/kunnon-muutto.png", alt: "Company logo 5" },
  { src: "/images/logos/roudarit.png", alt: "Company logo 6" },
];

export default async function ContractorLogoCarousel({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "lander" });
  return (
    <div className="w-full overflow-hidden  px-4 py-10">
      <div className="my-2 flex justify-center">
        <p className="text-xl text-black dark:text-white font-bold">
          {t("contractorLogoCarousel.title")}
        </p>
      </div>
      <div className="flex animate-carousel">
        {[...logos, ...logos].map((logo, index) => (
          <div
            key={index}
            className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-4"
          >
            <AspectRatio.Root ratio={2 / 1}>
              <div className="relative w-full h-full">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </AspectRatio.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
