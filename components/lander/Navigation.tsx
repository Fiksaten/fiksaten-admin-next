"use client";

import Link from "next/link";
import UserNavComponent from "./UserNavComponent";
import { useAuth } from "../AuthProvider";
import { LayoutDashboard, PlusCircle, ListOrdered, Settings } from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";
import LanguageSelector from "../LanguageSelector";
import { useParams } from "next/navigation";
import { AvailableLocale, Dictionary } from "@/lib/dictionaries";

export const Navigation = ({dict}: {dict: Dictionary}) => {
	const { user } = useAuth();
	const {lang} = useParams();
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
      <LanguageSelector currentLang={lang as AvailableLocale || 'fi'} />
			<ul className="hidden lg:flex space-x-6">
				{isConsumer ? (
					<>
						<NavLink href="/consumer/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text={dict.navigation.dashboard} />
						<NavLink href="/consumer/dashboard/new-request" icon={<PlusCircle className="h-5 w-5" />} text={dict.navigation.newRequest} />
						<NavLink href="/consumer/dashboard/orders" icon={<ListOrdered className="h-5 w-5" />} text={dict.navigation.orders} />
						<NavLink href="/consumer/dashboard/settings" icon={<Settings className="h-5 w-5" />} text={dict.navigation.settings} />
						<NavLink href="/logout" icon={<ExitIcon className="h-5 w-5" />} text={dict.navigation.logout} />
					</>
				) : (
					<>
						<li><Link href="/register" className="text-black font-semibold hover:text-gray-500">{dict.navigation.sendRequest}</Link></li>
						<li><Link href="/yrityksesta" className="text-black font-semibold hover:text-gray-500">{dict.navigation.aboutUs}</Link></li>
						<li><Link href="/register?type=contractor" className="text-black font-semibold hover:text-gray-500">{dict.navigation.joinUs}</Link></li>
						<li><Link href="/asiakaspalvelu" className="text-black font-semibold hover:text-gray-500">{dict.navigation.customerService}</Link></li>
					</>
				)}
			</ul>
			<UserNavComponent />
		</nav>
	);
};

export default Navigation;