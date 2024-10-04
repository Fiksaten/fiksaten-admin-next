"use client"
import Image from "next/image";
import { useIntersectionObserver } from "./Observer";

const ImageContainer = () => (
  <div className="w-full h-full">
    <Image
      src={"/images/young-moustache-man.webp"}
      alt="Woman on her phone"
      width={700}
      height={700}
      className="rounded-sm w-full h-full object-cover"
    />
  </div>
);

const TextContainer = () => (
  <div className="w-full h-full flex flex-col justify-start bg-[#FFF8CF] p-14 rounded-sm">
    <h1 className="text-4xl lg:text-6xl font-bold mb-4">
      Löydä tekijä läheltä sinua
    </h1>
    <p className="text-base lg:text-lg text-gray-700 mb-6">
      Voit kilpailuttaa pienenkin työn helposti ja nopeasti. Lähetä vain
      avuntarvepyyntö työstäsi ja valitse sopiva tarjous apulaiselta. Kotona
      tehtävä työ on kotitalousvähennyskelpoinen.
    </p>
  </div>
);

export default function HeroSection() {
  const handleIntersection = (element: Element) => {
    element.classList.add('visible');
  };

  const sectionRef = useIntersectionObserver(handleIntersection, { threshold: 0.5 });

  return (
    <section ref={sectionRef} className="section transition-all transform duration-700 ease-out opacity-0 translate-y-10 flex flex-col lg:flex-row items-center justify-center py-8 lg:py-12 px-4 lg:px-8 bg-white">
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mb-8 lg:mb-0 mx-2">
        <TextContainer />
      </div>
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mx-2">
        <ImageContainer />
      </div>
    </section>
  );
}
