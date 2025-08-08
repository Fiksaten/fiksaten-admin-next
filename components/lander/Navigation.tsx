"use client";

import { useRef } from "react";
import Link from "next/link";
import UserNavComponent from "./UserNavComponent";
import MobileNav from "@/components/ui/MobileNav";
import { useTranslations } from "next-intl";

export default function Navigation() {
  const t = useTranslations("");
  const navRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={navRef}
      className="flex flex-col items-center justify-center gap-4"
    >
      <nav className="container px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-primary"
        >
          <p className="text-2xl font-bold text-primary">Fiksaten</p>
        </Link>

        <ul className="hidden xl:flex space-x-6">
          <li>
            <Link
              href="/register"
              className="flex items-center rounded-lg px-4 py-2 text-foreground hover:bg-muted relative"
            >
              {t("navigation.sendRequest")}
            </Link>
          </li>
          <li>
            <Link
              href="/yrityksesta"
              className="flex items-center rounded-lg px-4 py-2 text-foreground hover:bg-muted relative"
            >
              {t("navigation.aboutUs")}
            </Link>
          </li>
          <li>
            <Link
              href="/register?type=contractor"
              className="flex items-center rounded-lg px-4 py-2 text-foreground hover:bg-muted relative"
            >
              {t("navigation.joinUs")}
            </Link>
          </li>
          <li>
            <Link
              href="/asiakaspalvelu"
              className="flex items-center rounded-lg px-4 py-2 text-foreground hover:bg-muted relative"
            >
              {t("navigation.customerService")}
            </Link>
          </li>
        </ul>
        <UserNavComponent />
        <MobileNav navRef={navRef}>
          <ul className="flex flex-col">
            <li>
              <Link
                href="/register"
                className="flex font-semibold text-xl items-center rounded-lg py-2 text-foreground hover:bg-muted relative"
              >
                {t("navigation.sendRequest")}
              </Link>
            </li>
            <li>
              <Link
                href="/yrityksesta"
                className="flex font-semibold text-xl items-center rounded-lg py-2 text-foreground hover:bg-muted relative"
              >
                {t("navigation.aboutUs")}
              </Link>
            </li>
            <li>
              <Link
                href="/register?type=contractor"
                className="flex font-semibold text-xl items-center rounded-lg py-2 text-foreground hover:bg-muted relative"
              >
                {t("navigation.joinUs")}
              </Link>
            </li>
            <li>
              <Link
                href="/asiakaspalvelu"
                className="flex font-semibold text-xl items-center rounded-lg py-2 text-foreground hover:bg-muted relative"
              >
                {t("navigation.customerService")}
              </Link>
            </li>
          </ul>
          <UserNavComponent isMobile />
        </MobileNav>
      </nav>
    </div>
  );
}
