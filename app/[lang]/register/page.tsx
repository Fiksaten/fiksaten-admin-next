import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import RegisterForm from "./RegisterForm";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

type PageProps = {
  params: Promise<{ lang: AvailableLocale }>;
  searchParams: Promise<{ type?: "consumer" | "contractor" }>;
};

export default async function Register({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex-grow flex flex-col lg:flex-row bg-white p-4 sm:p-8 lg:p-12 items-center justify-center">
      <div className="w-full lg:w-1/3 hidden lg:block">
        <AspectRatio ratio={9 / 16}>
          <Image
            src="/images/login.webp"
            width={1000}
            height={1000}
            alt="Login"
            className="w-full h-full object-cover"
          />
        </AspectRatio>
      </div>
      <div className="w-full lg:w-2/5 p-4 sm:p-8 lg:p-12">
        <RegisterForm
          dict={dict}
          type={(await searchParams).type ?? "consumer"}
        />
      </div>
    </div>
  );
}
