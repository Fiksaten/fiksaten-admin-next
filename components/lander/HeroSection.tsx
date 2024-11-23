"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useIntersectionObserver } from "./Observer";
import { Dictionary } from "@/lib/dictionaries";
import contractorLander from "@/public/images/contractor-lander.webp";

interface HeroSectionProps {
  dict: Dictionary;
}

const ImageContainer = () => (
  <div className="flex-shrink-0 mt-8 lg:mt-0">
    <Image
      src={contractorLander}
      alt="Contractor Lander"
      width={700}
      height={700}
      className="rounded-lg w-full max-w-[500px] lg:max-w-[700px]"
    />
  </div>
);

const TextContainer = ({ dict }: HeroSectionProps) => (
  <div className="xl:pr-8">
    <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-black">
      {dict.lander.heroSection.title}
    </h1>
    <p className="text-base lg:text-lg text-gray-700 mb-6">
      {dict.lander.heroSection.description}
    </p>
    <div className="flex flex-col sm:flex-row xl:justify-start justify-center space-y-4 sm:space-y-0 sm:space-x-4 pb-4">
      <Button 
        variant="default" 
        className="bg-[#007AFF] text-white rounded-lg text-base lg:text-lg font-semibold w-full sm:w-auto px-6 py-6"
      >
        {dict.lander.heroSection.actionPrimary}
      </Button>
      <Button 
        variant="outline" 
        className="border border-[#007AFF] text-[#007AFF] rounded-lg text-base lg:text-lg font-semibold w-full sm:w-auto px-6 py-6"
      >
        {dict.lander.heroSection.actionSecondary}
      </Button>
    </div>
  </div>
);

export default function HeroSection({ dict }: HeroSectionProps) {
  const handleIntersection = (element: Element) => {
    element.classList.add('visible');
  };

  const sectionRef = useIntersectionObserver(handleIntersection, { threshold: 0.3 });

  return (
    <section ref={sectionRef} className="section transition-all transform duration-700 ease-out opacity-0 translate-y-10 flex flex-col xl:flex-row items-center justify-center py-8 xl:py-12 px-4 lg:px-8 bg-white">
      <TextContainer dict={dict} />
      <ImageContainer />
    </section>
  );
}
