import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import LoginForm from "./LoginForm";
import Link from "next/link";
import Navigation from "@/components/lander/Navigation";
import PromotionHeader from "@/components/lander/PromotionHeader";
import Footer from "@/components/lander/Footer";
import { getDictionary } from "@/lib/dictionaries";
import login from "@/public/images/login.webp";

export default async function Login() {
  const dict = await getDictionary('fi');
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm">
        <PromotionHeader dict={dict} />
        <Navigation dict={dict} />
      </header>
      <div className="flex justify-end p-4">
        <Link href="/register" className="text-blue-500 underline">
          Eikö sinulla ole vielä tiliä?
        </Link>
      </div>
      <main className="flex-grow flex flex-col lg:flex-row bg-white p-4 sm:p-8 lg:p-12 items-center justify-center">
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
      </main>
      <Footer />
    </div>
  );
}
