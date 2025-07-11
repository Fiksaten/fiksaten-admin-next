"use client";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { useIntersectionObserver } from "./Observer";

const TextContainer = () => {
  const t = useTranslations();
  return (
    <div className="w-full">
      <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-black dark:text-white">
        {t("lander.heroSection.title")}
      </h1>
      <p className="text-base lg:text-lg text-gray-700 mb-6">
        {t("lander.heroSection.description")}
      </p>
      <div className="flex flex-col sm:flex-row xl:justify-start justify-center space-y-4 sm:space-y-0 sm:space-x-4 pb-4">
        <Button
          variant="default"
          className="rounded-lg text-base lg:text-lg font-semibold w-full sm:w-auto px-6 py-6"
        >
          {t("lander.heroSection.actionPrimary")}
        </Button>
        <Button
          variant="outline"
          className="rounded-lg text-base lg:text-lg font-semibold w-full sm:w-auto px-6 py-6"
        >
          {t("lander.heroSection.actionSecondary")}
        </Button>
      </div>
    </div>
  );
};

export default function HeroSection() {
  const handleIntersection = (element: Element) => {
    element.classList.add("visible");
  };

  const sectionRef = useIntersectionObserver(handleIntersection, {
    threshold: 0.3,
  });

  return (
    <section
      ref={sectionRef}
      className="section transition-all transform duration-700 ease-out opacity-0 translate-y-10 flex flex-col xl:flex-row items-center justify-center py-8 xl:py-12 px-4 "
    >
      <TextContainer />
    </section>
  );
}
