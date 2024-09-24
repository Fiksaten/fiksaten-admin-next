import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to My Authenticated App</h1>
      <p>This is a Next.js application with authentication using the App Router.</p>
      <div className="space-x-4">
        <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </Link>
        <Link href="/dashboard" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Dashboard
        </Link>
      </div>
    </div>
  )
}