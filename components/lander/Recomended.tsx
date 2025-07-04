"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useIntersectionObserver } from "./Observer";
import Link from "next/link";
import youngManSmiling from "@/public/images/young-man-smiling.webp";
import { useTranslations } from "next-intl";

const ImageContainer = () => (
  <div className="w-full h-full">
    <Image
      src={youngManSmiling}
      alt="Young man smiling"
      width={700}
      height={700}
      className="rounded-sm w-full h-full object-cover"
    />
  </div>
);

const TextContainer = () => {
  const t = useTranslations();
  return (
    <div className="w-full h-full flex flex-col justify-center bg-white p-8 rounded-sm">
      <h1 className="text-xl text-black dark:text-white lg:text-2xl font-semibold mb-4 italic">
        {t("lander.recomendedSection.title")}
      </h1>
      <div className="my-12">
        <p className="font-bold text-lg">
          {t("lander.recomendedSection.description")}
        </p>
        <p className="text-sm text-gray-500">
          {t("lander.recomendedSection.additionalDescription")}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="https://fi.trustpilot.com/review/fiksaten.fi">
          <Button
            variant="default"
            className="bg-[#007AFF] text-white rounded-lg text-base lg:text-lg font-semibold w-full sm:w-auto px-6 py-6"
          >
            {t("lander.recomendedSection.actionPrimary")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default function Recomended() {
  const handleIntersection = (element: Element) => {
    element.classList.add("visible");
  };

  const sectionRef = useIntersectionObserver(handleIntersection, {
    threshold: 0.3,
  });

  return (
    <section
      ref={sectionRef}
      className="section transition-all transform duration-700 ease-out opacity-0 translate-y-10 flex flex-col lg:flex-row items-center justify-center py-8 lg:py-12 px-4 bg-white"
    >
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mb-8 lg:mb-0 mx-2">
        <TextContainer />
      </div>
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mx-2">
        <ImageContainer />
      </div>
    </section>
  );
}
