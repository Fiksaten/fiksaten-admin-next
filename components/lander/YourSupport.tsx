"use client"
import Image from "next/image";
import { Button } from "../ui/button";
import { useIntersectionObserver } from "./Observer";
import Link from "next/link";
import { Dictionary } from "@/lib/dictionaries";
import manFixingWasher from "@/public/images/man-fixing-washer.webp";

const ImageContainer = ({dict}: {dict: Dictionary}) => (
  <div className="w-full h-full relative">
    <Image
      src={manFixingWasher}
      alt="Man fixing washer"
      width={700}
      height={700}
      className="rounded-sm w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-40 text-white p-16">
      <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-start">
        {dict.lander.yourSupportSection.imageTitle}
      </h2>
      <p className="text-lg text-white mb-6">
        {dict.lander.yourSupportSection.imageDescription}
      </p>
      <Link href="/register?type=contractor">
      <Button
        variant="default"
        className="bg-[#007AFF] text-white rounded-lg text-base lg:text-lg font-semibold w-full sm:w-auto px-6 py-6"
      >
        {dict.lander.yourSupportSection.actionPrimary}
      </Button>
      </Link>
    </div>
  </div>
);

const TextContainer = ({dict}: {dict: Dictionary}) => (
  <div className="w-full h-full flex flex-col justify-start bg-[#FFEFFC] p-14 rounded-sm">
    <h1 className="text-4xl text-black lg:text-6xl font-bold mb-4">
      {dict.lander.yourSupportSection.title}
    </h1>
    <p className="text-base lg:text-lg text-gray-700 mb-6">
      {dict.lander.yourSupportSection.description}
    </p>
    <p className="text-base lg:text-lg text-gray-700">
      {dict.lander.yourSupportSection.additionalDescription}
    </p>
  </div>
);

export default function YourSupport({dict}: {dict: Dictionary}) {
    const handleIntersection = (element: Element) => {
      element.classList.add('visible');
    };
  
    const sectionRef = useIntersectionObserver(handleIntersection, { threshold: 0.3 });
  
    return (
      <section ref={sectionRef} className="section transition-all transform duration-700 ease-out opacity-0 translate-y-10 flex flex-col lg:flex-row items-center justify-center py-8 lg:py-12 px-4 lg:px-8 bg-white">
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mb-8 lg:mb-0 mx-2">
        <TextContainer dict={dict} />
      </div>
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mx-2">
        <ImageContainer dict={dict} />
      </div>
    </section>
  );
}
