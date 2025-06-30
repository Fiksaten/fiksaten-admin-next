import Link from "next/link";

interface PageProps {
  params: { accountId: string };
}

export default function StripeReturnSuccessPage({ params }: PageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <svg
        className="w-20 h-20 text-green-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2l4-4"
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
      <h1 className="text-2xl font-bold mb-2">Stripe-tili yhdistetty!</h1>
      <p className="mb-4 text-center text-gray-600">
        Stripe-tilisi ({params.accountId}) on yhdistetty onnistuneesti.
        <br />
        Voit nyt vastaanottaa maksuja alustalla.
      </p>
      <Link
        href="/"
        className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
      >
        Palaa etusivulle
      </Link>
    </div>
  );
}
