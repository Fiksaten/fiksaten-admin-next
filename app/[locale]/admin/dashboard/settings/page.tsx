import Link from 'next/link';

interface CardProps {
  title: string;
  path: string;
}

function Card({ title, path }: CardProps) {
  return (
    <Link href={path}>
      <div className="bg-white text-black shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">Manage {title.toLowerCase()}</p>
      </div>
    </Link>
  );
}


export default async function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <Card title="Categories" path="/admin/dashboard/settings/categories" />
      <Card title="Reviews" path="/admin/dashboard/settings/reviews" />
      <Card title="Users" path="/admin/dashboard/users" />
      <Card title="Contractors" path="/admin/dashboard/users" />
      <Card title="Orders" path="/admin/dashboard/settings/orders" />
    </div>
  );
}
