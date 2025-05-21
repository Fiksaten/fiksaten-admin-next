"use client"
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "../AuthProvider";
import {AvailableLocale, Dictionary} from "@/lib/dictionaries";
import LanguageSelector from "../LanguageSelector";
const UserNavComponent = ({ dict, isMobile = false }: { dict: Dictionary, isMobile?: boolean }) => {
    const { user, logout } = useAuth();
    return (
        <div className={`flex ${isMobile ? 'flex-col' : 'max-xl:hidden'} items-center gap-4`}>
        {user ? (
            <div className={`flex ${isMobile ? 'flex-col' : ''}`}>
                <span className="text-black font-semibold">
                    Moikka {user?.firstname} {user?.lastname?.charAt(0) || ""}!
                </span>
                <Button
                    variant="outline"
                    className="text-[#6B7280] font-semibold"
                    onClick={logout}
                >
                    <LogOut className="mr-2 h-4 w-4"/>
                    {dict.navigation.logout}
                </Button>
            </div>
        ) : (
            <div className={`flex ${isMobile ? 'flex-col w-full gap-4 ' : ''} gap-2`}>
                <Link href="/login">
                    <Button variant="outline" className={`${isMobile ? 'w-full font-semibold text-xl py-2 h-full' : ''} text-black font-semibold`}>{dict.navigation.login}</Button>
                </Link>
                <Link href="/register">
                    <Button variant="default" className={`${isMobile ? 'w-full font-semibold text-xl py-2 h-full' : ''} bg-[#007AFF] text-white font-semibold`}>{dict.navigation.register}</Button>
                </Link>
            </div>
        )}
    </div>

    )
}

export default UserNavComponent;
