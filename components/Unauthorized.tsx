import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import posthog from 'posthog-js';
import bouncer from "@/public/images/bouncer.webp";

const quotes = [
  "Ever feel like the last one to find out the joke?",
  "Next time, bring a better disguise!",
  "Maybe try turning it off and on again?",
];

const Unauthorized = () => {
  const [quote, setQuote] = useState<string>("");

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  useEffect(() => {
    posthog.capture("unauthorized_access");
  }, []);

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Nice try, but no.");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black">
      <div className="bg-black flex flex-col p-8 shadow-md rounded-md text-center justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Oops! You&apos;re Trying to Sneak Into a Secret Club… But You&apos;re Not on the List.</h1>
        <p className="text-lg mb-6">
          Looks like you&apos;ve tried to access an exclusive area of the site. Unfortunately, only authorized agents, ninjas, or hackers are allowed beyond this point
        </p>
        <Image 
          src={bouncer} 
          alt="Bouncer turning away a cat in disguise"
          className="my-6"
          width={400} 
          height={300} 
        />

        <form onSubmit={handlePasswordSubmit} className="my-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Got a secret password? Try your luck:
          </label>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              id="password" 
              className="border border-gray-300 p-2 rounded-md w-full"
              placeholder="Enter secret password"
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Submit
            </button>
          </div>
        </form>

            <p className="italic text-gray-200 mb-6">&quot;{quote}&quot;</p>

        <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-600">
          
            Take Me Back to Safety
          
        </Link>

        <footer className="mt-6 text-gray-500">
          Don&apos;t worry, you&apos;re not the only one. We&apos;ve turned away 1,043 nosy users today!
        </footer>
      </div>
    </div>
  );
};

export default Unauthorized;
