import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import LoginForm from "./LoginForm";
import Link from "next/link";
import login from "@/public/images/login.webp";
import {AvailableLocale, getDictionary} from "@/lib/dictionaries";

export default async function Login({ params: { lang } }: { params: { lang: AvailableLocale } }) {
  const dict = await getDictionary(lang);
  return (
      <>
      <div className="flex justify-end p-4">
        <Link href="/register" className="text-blue-500 underline">
          Eikö sinulla ole vielä tiliä?
        </Link>
      </div>
        <div className="w-full lg:w-1/3 hidden lg:block">
          <AspectRatio ratio={9 / 16}>
            <Image
              src={login}
              width={1000}
              height={1000}
              alt="Login"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
        <div className="w-full lg:w-2/5 p-4 sm:p-8 lg:p-12">
          <LoginForm />
        </div>
      </>
  );
}
