import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navigation() {
    return(
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            <h1 className="text-2xl font-bold text-[#F3D416]">Fiksaten</h1>
          </Link>
          <ul className="hidden lg:flex space-x-6">
            <li><Link href="/register" className="text-black font-semibold hover:text-gray-500">Ilmoita avuntarve</Link></li>
            <li><Link href="/yrityksesta" className="text-black font-semibold hover:text-gray-500">Mikä on Fiksaten</Link></li>
            <li><Link href="/register?type=contractor" className="text-black font-semibold hover:text-gray-500">Liity apulaiseksi</Link></li>
            <li><Link href="/asiakaspalvelu" className="text-black font-semibold hover:text-gray-500">Asiakaspalvelu</Link></li>
          </ul>
          <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="hidden lg:inline-flex text-[#6B7280] font-semibold">Kirjaudu</Button>
          </Link>
          <Link href="/register">
            <Button variant="default" className="hidden bg-[#007AFF] text-white font-semibold lg:inline-flex">Rekisteröidy</Button>
            </Link>
            
          <Link href="/login" className="lg:hidden flex flex-row items-center gap-2">
          <p className="text-black">Kirjaudu sisään</p>
            <Button variant="outline" size="icon" className="lg:hidden">
              <ArrowRight className="text-black h-4 w-4" />
            </Button>
          </Link>
          </div>
        </nav>
    )

}