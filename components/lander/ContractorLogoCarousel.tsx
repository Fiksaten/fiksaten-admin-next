import Image from 'next/image'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import { Dictionary } from '@/lib/dictionaries'
import cliifax from "@/public/images/logos/cliifax.png";
import eld from "@/public/images/logos/eld.png";
import jks from "@/public/images/logos/jks.png";
import jtk from "@/public/images/logos/jtk-sahko.png";
import kunnon from "@/public/images/logos/kunnon-muutto.png";
import roudarit from "@/public/images/logos/roudarit.png";
const logos = [
  { src: cliifax, alt: 'Company 1' },
  { src: eld, alt: 'Company 2' },
  { src: jks, alt: 'Company 3' },
  { src: jtk, alt: 'Company 4' },
  { src: kunnon, alt: 'Company 5' },
  { src: roudarit, alt: 'Company 6' },
]

export default function ContractorLogoCarousel({dict}: {dict: Dictionary}) {
  return (
    <div className="w-full overflow-hidden bg-white py-10">
        <div className="my-2 flex justify-center">  
            <p className="text-xl text-black font-bold">{dict.lander.contractorLogoCarousel.title}</p>
        </div>
      <div className="flex animate-carousel">
        {[...logos, ...logos].map((logo, index) => (
          <div key={index} className="flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-4">
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
  )
}