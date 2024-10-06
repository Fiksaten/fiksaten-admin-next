"use client";

import Link from "next/link";
import UserNavComponent from "./UserNavComponent";
import { useAuth } from "../AuthProvider";
import { LayoutDashboard, PlusCircle, ListOrdered, Settings } from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";

export const Navigation: React.FC = () => {
	const { user } = useAuth();

	const isConsumer = user && user.role === "consumer";

	const NavLink: React.FC<{ href: string; icon: React.ReactNode; text: string }> = ({ href, icon, text }) => (
		<li>
			<Link href={href} className="flex items-center text-black font-semibold hover:text-gray-500">
				{icon}
				<span className="ml-2">{text}</span>
			</Link>
		</li>
	);

	return (
		<nav className="container mx-auto px-4 py-4 flex items-center justify-between">
			<Link href="/" className="text-2xl font-bold text-primary">
				<h1 className="text-2xl font-bold text-[#F3D416]">Fiksaten</h1>
			</Link>
			<ul className="hidden lg:flex space-x-6">
				{isConsumer ? (
					<>
						<NavLink href="/consumer/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" />
						<NavLink href="/consumer/dashboard/new-request" icon={<PlusCircle className="h-5 w-5" />} text="New Request" />
						<NavLink href="/consumer/dashboard/orders" icon={<ListOrdered className="h-5 w-5" />} text="Orders" />
						<NavLink href="/consumer/dashboard/settings" icon={<Settings className="h-5 w-5" />} text="Settings" />
						<NavLink href="/logout" icon={<ExitIcon className="h-5 w-5" />} text="Logout" />
					</>
				) : (
					<>
						<li><Link href="/register" className="text-black font-semibold hover:text-gray-500">Ilmoita avuntarve</Link></li>
						<li><Link href="/yrityksesta" className="text-black font-semibold hover:text-gray-500">Mikä on Fiksaten</Link></li>
						<li><Link href="/register?type=contractor" className="text-black font-semibold hover:text-gray-500">Liity apulaiseksi</Link></li>
						<li><Link href="/asiakaspalvelu" className="text-black font-semibold hover:text-gray-500">Asiakaspalvelu</Link></li>
					</>
				)}
			</ul>
			<UserNavComponent />
		</nav>
	);
};

export default Navigation;