"use client"
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { AvailableLocale } from "@/lib/dictionaries";
import LanguageSelector from "../LanguageSelector";

const UserNavComponent = ({ lang }: { lang: AvailableLocale }) => {
    const { user, logout } = useAuth();
    return (
        <div className="flex items-center gap-4">
        {user ? (
            <>
                <span className="hidden lg:inline-flex text-black font-semibold">
                    Moikka {user?.firstname} {user?.lastname?.charAt(0) || ""}!
                </span>
                <Button
                    variant="outline"
                    className="hidden lg:inline-flex text-[#6B7280] font-semibold"
                    onClick={logout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Kirjaudu ulos
                </Button>
            </>
        ) : (
            <>
                <Link href="/login">
                    <Button variant="outline" className="hidden lg:inline-flex text-[#6B7280] font-semibold">Kirjaudu</Button>
                </Link>
                <Link href="/register">
                    <Button variant="default" className="hidden bg-[#007AFF] text-white font-semibold lg:inline-flex">Rekisteröidy</Button>
                </Link>
                <LanguageSelector currentLang={lang as AvailableLocale || 'fi'} />
            </>
        )}
        
        {/* Mobile view */}
        <Link href={user ? "/profile" : "/login"} className="lg:hidden flex flex-row items-center gap-2">
            <p className="text-black">{user ? `${user?.firstname} ${user?.lastname?.charAt(0) || ""}.` : "Kirjaudu sisään"}</p>
            <Button variant="outline" size="icon" className="lg:hidden">
                <ArrowRight className="text-black h-4 w-4" />
            </Button>
        </Link>
    </div>

    )
}

export default UserNavComponent;