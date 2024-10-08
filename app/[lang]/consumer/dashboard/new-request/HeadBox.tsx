import Image from "next/image";
import { Dictionary } from "@/lib/dictionaries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const ImageContainer = ({ imageName }: { imageName: string }) => (
  <div className="w-full h-full">
    <Image
      src={`/images/${imageName}.webp`}
      alt={imageName}
      width={700}
      height={700}
      className="rounded-sm w-full h-full object-cover"
    />
  </div>
);

const TextContainer = ({
  dict,
  title,
  description,
  callToAction,
  callToActionHref,
}: {
  dict: Dictionary;
  title: string;
  description: string;
  callToAction?: string;
  callToActionHref?: string;
}) => (
  <div className="w-full h-full flex flex-col justify-start bg-[#E5F4FF] p-14 rounded-sm">
    <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-black">{title}</h1>
    <p className="text-base lg:text-lg text-gray-700 mb-6">{description}</p>
    {callToAction && callToActionHref && (
      <Link href={callToActionHref}>
        <Button
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 text-white justify-start text-left font-normal"
        >
          {callToAction}
        </Button>
      </Link>
    )}
  </div>
);

export default function HeadBox({
  dict,
  title,
  description,
  imageName,
  callToAction,
  callToActionHref,
}: {
  dict: Dictionary;
  title: string;
  description: string;
  imageName: string;
  callToAction?: string;
  callToActionHref?: string;
}) {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center py-8 lg:py-12">
      <div className="w-full lg:w-1/2 h-[300px] lg:h-[400px] mb-8 lg:mb-0">
        <ImageContainer imageName={imageName} />
      </div>
      <div className="w-full lg:w-1/2 h-[300px] lg:h-[400px]">
        <TextContainer
          dict={dict}
          title={title}
          description={description}
          callToAction={callToAction}
          callToActionHref={callToActionHref}
        />
      </div>
    </section>
  );
}
