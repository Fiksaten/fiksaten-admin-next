"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/components/AuthProvider";
import { buildApiUrl } from "@/app/lib/utils";
import Cookies from "js-cookie";
import { toast } from "@/hooks/use-toast";
import { AvailableLocale, Dictionary } from "@/lib/dictionaries";
import UserNavComponent from "./UserNavComponent";
import { useParams } from "next/navigation";

export default function Navigation({ dict }: { dict: Dictionary }) {
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
    const intervalId = setInterval(fetchUserBadges, 30000);
    fetchUserBadges();
    return () => clearInterval(intervalId);
  }, [fetchUserBadges]);

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

  const NavLink: React.FC<{
    href: string;
    text: string;
    countKey?: keyof typeof unreadCounts;
  }> = ({ href, text, countKey }) => (
    <li>
    <Link
      href={href}
      className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100 relative"
      onClick={() => {
        if (countKey) {
          resetUnreadCount(countKey);
        }
      }}
    >
      {text}
      {countKey && unreadCounts[countKey] > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {unreadCounts[countKey]}
        </span>
      )}
      </Link>
    </li>
  );

  return (
    <div className="flex items-center gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center justify-center border-b">
            <h1 className="text-2xl font-bold text-gray-800">Fiksaten</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <NavLink
              href="/consumer/dashboard"
              text={dict.navigation.dashboard}
              countKey="dashboard"
            />
            <NavLink
              href="/consumer/dashboard/new-request"
              text={dict.navigation.newRequest}
              countKey="newRequest"
            />
            <NavLink
              href="/consumer/dashboard/orders"
              text={dict.navigation.orders}
              countKey="orders"
            />
            <NavLink
              href="/consumer/dashboard/settings"
              text={dict.navigation.settings}
              countKey="settings"
            />
          </nav>
        </SheetContent>
      </Sheet>
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          <h1 className="text-2xl font-bold text-[#F3D416]">Fiksaten</h1>
        </Link>

        <ul className="hidden lg:flex space-x-6">
          {isConsumer ? (
            <>
              <NavLink
                href="/consumer/dashboard"
                text={dict.navigation.dashboard}
                countKey="dashboard"
              />
              <NavLink
                href="/consumer/dashboard/new-request"
                text={dict.navigation.newRequest}
                countKey="newRequest"
              />
              <NavLink
                href="/consumer/dashboard/orders"
                text={dict.navigation.orders}
                countKey="orders"
              />
              <NavLink
                href="/consumer/dashboard/settings"
                text={dict.navigation.settings}
                countKey="settings"
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
        <UserNavComponent lang={(lang as AvailableLocale) || "fi"} />
      </nav>
    </div>
  );
}
