import React from "react";
import Link from "next/link";
import { NavLinkType } from "@/lib/types";

export default function NavLink({
  href,
  text,
  countKey,
  unreadCounts,
  resetUnreadCount,
}: NavLinkType): React.ReactNode {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center rounded-lg px-4 py-2 text-black dark:text-white hover:bg-gray-100 relative"
        onClick={() => {
          if (countKey) {
            resetUnreadCount?.(countKey);
          }
        }}
      >
        {text}
        {countKey && unreadCounts && unreadCounts[countKey] > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadCounts[countKey]}
          </span>
        )}
      </Link>
    </li>
  );
}
