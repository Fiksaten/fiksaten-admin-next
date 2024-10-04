import Link from "next/link";
import UserNavComponent from "./UserNavComponent";

export const Navigation: React.FC = () => {
	return (
		<nav className="container mx-auto px-4 py-4 flex items-center justify-between">
			<Link href="/" className="text-2xl font-bold text-primary">
				<h1 className="text-2xl font-bold text-[#F3D416]">Fiksaten</h1>
			</Link>
			<ul className="hidden lg:flex space-x-6">
				<li><Link href="/register" className="text-black font-semibold hover:text-gray-500">Ilmoita avuntarve</Link></li>
				<li><Link href="/yrityksesta" className="text-black font-semibold hover:text-gray-500">Mikä on Fiksaten</Link></li>
				<li><Link href="/register?type=contractor" className="text-black font-semibold hover:text-gray-500">Liity apulaiseksi</Link></li>
				<li><Link href="/asiakaspalvelu" className="text-black font-semibold hover:text-gray-500">Asiakaspalvelu</Link></li>
			</ul>
      <UserNavComponent />
		</nav>
	);
};

export default Navigation;