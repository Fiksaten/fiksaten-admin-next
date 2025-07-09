"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { useTranslations } from "next-intl";

const UserNavComponent = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { user, logout } = useAuth();
  const t = useTranslations("");
  return (
    <div
      className={`flex ${
        isMobile ? "flex-col" : "max-xl:hidden"
      } items-center gap-4`}
    >
      {user ? (
        <div className={`flex w-full ${isMobile ? "flex-col" : ""}`}>
          <span className="text-black dark:text-white dark:text-white font-semibold">
            Moikka {user?.firstname} {user?.lastname?.charAt(0) || ""}!
          </span>
          <Button
            variant="outline"
            className="text-[#6B7280] dark:text-white font-semibold"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("navigation.logout")}
          </Button>
        </div>
      ) : (
        <div
          className={`flex ${isMobile ? "flex-col w-full gap-4 " : ""} gap-2`}
        >
          <Link href="/login">
            <Button
              variant="outline"
              className={`${
                isMobile ? "w-full font-semibold text-xl py-2 h-full" : ""
              } text-black dark:text-white dark:text-white font-semibold`}
            >
              {t("navigation.login")}
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="default"
              className={`${
                isMobile ? "w-full font-semibold text-xl py-2 h-full" : ""
              } bg-[#007AFF] text-white font-semibold`}
            >
              {t("navigation.register")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserNavComponent;
