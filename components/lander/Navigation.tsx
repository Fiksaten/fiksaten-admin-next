"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import { useAuth } from "@/components/AuthProvider";
import { buildApiUrl } from "@/app/lib/utils";
import Cookies from "js-cookie";
import { toast } from "@/hooks/use-toast";
import { AvailableLocale, Dictionary } from "@/lib/dictionaries";
import UserNavComponent from "./UserNavComponent";
import { useParams } from "next/navigation";
import NavLink from "@/components/NavLink";
import MobileNav from "@/components/ui/MobileNav";
import LanguageSelector from "@/components/LanguageSelector";

export default function Navigation({ dict }: { dict: Dictionary }) {
  const navRef = useRef<HTMLDivElement | null>(null)
  const idToken = Cookies.get("idToken");
  const [
    numberOfNotificationsChatsUnread,
    setNumberOfNotificationsChatsUnread,
  ] = useState(0);
  const [
    numberOfNotificationsRequestsUnread,
    setNumberOfNotificationsRequestsUnread,
  ] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({
    dashboard: 0,
    newRequest: 0,
    orders: numberOfNotificationsRequestsUnread,
    settings: 0,
    chats: numberOfNotificationsChatsUnread,
  });

  const { user } = useAuth();
  const isConsumer = user?.role === "consumer";
  const isContractor = user?.role === "contractor"
  const lang = useParams().lang;

  const fetchUserBadges = useCallback(async () => {
    console.log("Fetching badges...");
    try {
      const url = buildApiUrl("/users/me/badges");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await response.json();

      if (data) {
        const messages = data?.messages ? data.messages : 0;
        const offers = data?.offers ? data.offers : 0;
        setNumberOfNotificationsChatsUnread(messages);
        setNumberOfNotificationsRequestsUnread(offers);
        if (messages > 0) {
          toast({
            title: "You have new messages",
            description: "You have new messages",
          });
        }
        if (offers > 0) {
          toast({
            title: "You have new offers",
            description: "You have new offers",
          });
        }
      } else {
        setNumberOfNotificationsChatsUnread(0);
        setNumberOfNotificationsRequestsUnread(0);
      }
    } catch (error) {
      console.error(error);
    }
  }, [idToken]);

  useEffect(() => {
    if (user) {
      const intervalId = setInterval(fetchUserBadges, 30000);
      fetchUserBadges();
      return () => clearInterval(intervalId);
    }
  }, [fetchUserBadges, user]);

  const resetUnreadCount = useCallback(
    (key: keyof typeof unreadCounts) => {
      setUnreadCounts((prev) => ({ ...prev, [key]: 0 }));
      (async () => {
        let url;
        if (key === "chats") {
          url = buildApiUrl("users/me/badges/chats");
        } else if (key === "orders") {
          url = buildApiUrl("users/me/badges/offers");
        }
        if (url) {
          await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
        }
      })();
    },
    [idToken]
  );

  useEffect(() => {
    setUnreadCounts((prev) => ({
      ...prev,
      orders: numberOfNotificationsRequestsUnread,
    }));
  }, [numberOfNotificationsRequestsUnread]);

  return (
      <div ref={navRef} className="flex flex-col items-center justify-center gap-4">
        <div className="bg-[#007AFF] w-full text-white py-2">
          <p className="text-center text-sm font-bold">
            {dict.promotionHeader}
          </p>
        </div>
        <nav className="container px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            <p className="text-2xl font-bold text-[#0E54FF]">Fiksaten</p>
          </Link>

          <ul className="hidden xl:flex space-x-6">
            <li>
              <Link
                  href="/register"
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
              >
                {dict.navigation.sendRequest}
              </Link>
            </li>
            <li>
              <Link
                  href="/yrityksesta"
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
              >
                {dict.navigation.aboutUs}
              </Link>
            </li>
            <li>
              <Link
                  href="/register?type=contractor"
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
              >
                {dict.navigation.joinUs}
              </Link>
            </li>
            <li>
              <Link
                  href="/asiakaspalvelu"
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
              >
                {dict.navigation.customerService}
              </Link>
            </li>
          </ul>
          <UserNavComponent dict={dict} />
          <MobileNav lang={lang as AvailableLocale} navRef={navRef} dict={dict}>
            <ul className="flex flex-col">
              <li>
                <Link
                    href="/register"
                    className="flex font-semibold text-xl items-center rounded-lg py-2 text-black hover:bg-gray-100 relative"
                >
                  {dict.navigation.sendRequest}
                </Link>
              </li>
              <li>
                <Link
                    href="/yrityksesta"
                    className="flex font-semibold text-xl items-center rounded-lg py-2 text-black hover:bg-gray-100 relative"
                >
                  {dict.navigation.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                    href="/register?type=contractor"
                    className="flex font-semibold text-xl items-center rounded-lg py-2 text-black hover:bg-gray-100 relative"
                >
                  {dict.navigation.joinUs}
                </Link>
              </li>
              <li>
                <Link
                    href="/asiakaspalvelu"
                    className="flex font-semibold text-xl items-center rounded-lg py-2 text-black hover:bg-gray-100 relative"
                >
                  {dict.navigation.customerService}
                </Link>
              </li>
            </ul>
            <UserNavComponent isMobile dict={dict} />
          </MobileNav>
        </nav>
      </div>
  );
}

/*

return (
    <div className="flex items-center justify-center gap-4">
      <nav className="container px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          <p className="text-2xl font-bold text-[#0E54FF]">Fiksaten</p>
        </Link>

        <ul className="hidden xl:flex space-x-6">
          {isConsumer ? (
            <>
              <NavLink
                href="/consumer/dashboard"
                text={dict.navigation.dashboard}
                countKey="dashboard"
                resetUnreadCount={resetUnreadCount}
                unreadCounts={unreadCounts}
              />
              <NavLink
                href="/consumer/dashboard/new-request"
                text={dict.navigation.newRequest}
                countKey="newRequest"
                resetUnreadCount={resetUnreadCount}
                unreadCounts={unreadCounts}
              />
              <NavLink
                href="/consumer/dashboard/orders"
                text={dict.navigation.orders}
                countKey="orders"
                resetUnreadCount={resetUnreadCount}
                unreadCounts={unreadCounts}
              />
              <NavLink
                href="/consumer/dashboard/settings"
                text={dict.navigation.settings}
                countKey="settings"
                resetUnreadCount={resetUnreadCount}
                unreadCounts={unreadCounts}
              />
              <NavLink href="/logout" text={dict.navigation.logout} />
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/register"
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
                >
                  {dict.navigation.sendRequest}
                </Link>
              </li>
              <li>
                <Link
                  href="/yrityksesta"
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
                >
                  {dict.navigation.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/register?type=contractor"
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
                >
                  {dict.navigation.joinUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/asiakaspalvelu"
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
                >
                  {dict.navigation.customerService}
                </Link>
              </li>
            </>
          )}
        </ul>
        <UserNavComponent dict={dict} lang={(lang as AvailableLocale) || "fi"} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="xl:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-white p-0">
            <div className="flex h-16 items-center justify-center border-b">
              <SheetTitle className="text-2xl font-bold text-gray-800">Fiksaten</SheetTitle>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
            {isConsumer && (
                <>
              <NavLink
               href="/consumer/dashboard"
               text={dict.navigation.dashboard}
               countKey="dashboard"
               resetUnreadCount={resetUnreadCount}
               unreadCounts={unreadCounts}
              />
              <NavLink
                href="/consumer/dashboard/new-request"
                text={dict.navigation.newRequest}
                countKey="newRequest"
                resetUnreadCount={resetUnreadCount}
                unreadCounts={unreadCounts}
              />
              <NavLink
                  href="/consumer/dashboard/orders"
                  text={dict.navigation.orders}
                  countKey="orders"
                  resetUnreadCount={resetUnreadCount}
                  unreadCounts={unreadCounts}
              />
              <NavLink
                  href="/consumer/dashboard/settings"
                  text={dict.navigation.settings}
                  countKey="settings"
                  resetUnreadCount={resetUnreadCount}
                  unreadCounts={unreadCounts}
              />
              </>
             )}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
 */
