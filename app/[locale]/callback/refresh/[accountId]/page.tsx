import Link from "next/link";

interface PageProps {
  params: Promise<{ accountId: string }>;
}

export default async function StripeRefreshCallbackPage({ params }: PageProps) {
  const { accountId } = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <svg
        className="w-20 h-20 text-yellow-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
      <h1 className="text-2xl font-bold mb-2">Yhdistäminen keskeytyi</h1>
      <p className="mb-4 text-center text-gray-600">
        Stripe-tilin yhdistäminen ({accountId}) keskeytyi tai vaatii
        päivityksen.
        <br />
        Yritä uudelleen tai palaa hallintapaneeliin.
      </p>
      <div className="flex gap-4">
        <Link
          href={`/contractor/dashboard/settings`}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          Palaa asetuksiin
        </Link>
        <Link
          href={`/contractor/dashboard/settings`}
          className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Yritä uudelleen
        </Link>
      </div>
    </div>
  );
}
