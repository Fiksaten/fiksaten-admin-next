import Image from "next/image";
import AppleButton from "./AppleButton";
import { Dictionary } from "@/lib/dictionaries";
import youngWomanCouch from "@/public/images/young-woman-couch.webp";
const CallToActionDownload: React.FC<{dict: Dictionary}> = ({dict}) => {
  return (
    <div className="w-full relative px-4 sm:px-12 mb-12">
      <div className="aspect-[16/9] h-full relative">
        <Image
          src={youngWomanCouch}
          alt="Young woman on couch"
          fill
          className="rounded-sm object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 text-white p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col items-center justify-center">
          <div className="max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
              {dict.lander.callToActionDownload.title}
            </h2>
            <p className="hidden sm:block text-sm sm:text-base md:text-lg text-white mb-4 sm:mb-6">
              {dict.lander.callToActionDownload.description}
            </p>
          </div>
          <div className="sm:absolute sm:bottom-6 md:bottom-8 lg:bottom-12 flex justify-center w-full mt-4 sm:mt-0">
            <AppleButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionDownload;
