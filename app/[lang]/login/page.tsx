import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import LoginForm from "./LoginForm";
import Link from "next/link";
import login from "@/public/images/login.webp";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

type PageProps = {
  params: Promise<{ lang: AvailableLocale }>;
};

export default async function Login({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
      <div className='w-full gap-4 flex flex-col py-24 px-4 items-center'>
          <div className="w-full max-w-[500px] flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-black">{dict.login.title}</h1>
              <p className="text-muted-foreground">{dict.login.titleSecondary}</p>
          </div>
          <div className="w-full py-4 max-w-[500px] content-center">
              <LoginForm dict={dict}/>
          </div>
      </div>
  );
}
