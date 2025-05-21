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
      <div className='w-full gap-4 flex flex-col py-24 px-4 items-center'>
          <div className="w-full max-w-[800px] flex items-center sm:items-stretch">
              <h1 className="text-4xl text-black font-bold mb-6">
                  {dict.register.register}
              </h1>
          </div>
          <div className="w-full py-4 max-w-[800px] content-center">
              <RegisterForm
                  dict={dict}
                  type={(await searchParams).type ?? "consumer"}
              />
          </div>
      </div>
  );
}
