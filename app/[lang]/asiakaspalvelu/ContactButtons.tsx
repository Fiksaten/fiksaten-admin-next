import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import womanPhone from "@/public/images/woman-phone-lander.webp";
import {Dictionary} from "@/lib/dictionaries";

const ImageContainer = () => (
  <div className="w-full h-full">
    <Image
      src={womanPhone}
      alt="Woman on her phone"
      width={700}
      height={700}
      className="rounded-sm w-full h-full object-cover"
    />
  </div>
);

const TextContainer = ({ dict }: { dict: Dictionary }) => (
  <div className="w-full h-full flex flex-col justify-start bg-[#DEF8E4] p-14 rounded-sm">
    <h1 className="text-4xl lg:text-6xl font-bold mb-4">
        {dict.contact.title}
    </h1>
    <p className="text-base lg:text-lg text-gray-700 mb-6">
        {dict.contact.description}
    </p>
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <Link href="mailto:asiakaspalvelu@fiksaten.fi?subject=Fiksaten%20-%20Yhteydenottopyynt%C3%B6">
        <Button
          variant="default"
          className="bg-[#007AFF] text-white rounded-lg text-base lg:text-lg font-semibold w-full sm:w-auto px-6 py-6"
        >
            {dict.contact.emailFor}
        </Button>
      </Link>
      <Link href="tel:+358405377092">
        <Button
          variant="outline"
          className="border border-[#007AFF] text-[#007AFF] rounded-lg text-base lg:text-lg font-semibold w-full sm:w-auto px-6 py-6"
        >
            {dict.contact.callFor}
        </Button>
      </Link>
    </div>
  </div>
);

export default function SecondaryHero({ dict }: { dict: Dictionary }) {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center py-8 lg:py-12 px-4 lg:px-8 bg-white">
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mb-8 lg:mb-0 mx-2">
        <TextContainer dict={dict} />
      </div>
      <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] mx-2">
        <ImageContainer />
      </div>
    </section>
  );
}
