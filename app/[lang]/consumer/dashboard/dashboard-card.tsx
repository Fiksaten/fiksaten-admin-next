import React from "react";
import Link from "next/link";

export const DashboardCard = ({ title, href, children }: { title: string, href: string, children: React.ReactNode }) => {
  return (
    <Link href={href} className="block">
      <div className="border rounded-lg p-6 hover:shadow-md transition-shadow text-black">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{children}</p>
      </div>
    </Link>
  );
};