"use client"
import Image from "next/image";
import { useIntersectionObserver } from "./Observer";
import { Button } from "../ui/button";

const ImageContainer = () => (
  <div className="w-full h-full">
    <Image
      src={"/images/woman-phone-lander.webp"}
      alt="Woman on her phone"
      width={700}
      height={700}
      className="rounded-sm w-full h-full object-cover"
    />
  </div>
);

const TextContainer = () => (
  <div className="w-full h-full flex flex-col justify-start bg-[#E5F4FF] p-14 rounded-sm">
    <h1 className="text-4xl lg:text-6xl font-bold mb-4">
      Kilpailuta helposti mikä tahansa työ
    </h1>
    <p className="text-base lg:text-lg text-gray-700 mb-6">
      Voit kilpailuttaa pienenkin työn helposti ja nopeasti. Lähetä vain
      avuntarvepyyntö työstäsi ja valitse sopiva tarjous palveluista. Kotona
      tehtävä työ on kotitalousvähennyskelpoinen.
    </p>
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <Button
        variant="default"
        className="bg-[#007AFF] text-white rounded-lg text-base lg:text-lg font-semibold w-full sm:w-auto px-6 py-6"
      >
        Ilmoita avuntarve
      </Button>
    </div>
  </div>
);

export default function SecondaryHero() {
  const handleIntersection = (element: Element) => {
    element.classList.add('visible');
  };

  const sectionRef = useIntersectionObserver(handleIntersection, { threshold: 0.5 });

  return (
    <section ref={sectionRef} className="section transition-all transform duration-700 ease-out opacity-0 translate-y-10 flex flex-col lg:flex-row items-center justify-center py-8 lg:py-12 px-4 lg:px-8 bg-white">
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mb-8 lg:mb-0 mx-2">
        <ImageContainer />
      </div>
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mx-2">
        <TextContainer />
      </div>
    </section>
  );
}
