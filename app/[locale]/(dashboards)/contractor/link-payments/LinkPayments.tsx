"use client";
import { createAccountLink } from "@/app/lib/services/billingClientService";
import { useEffect } from "react";

export default function StripeConnect() {
  const handleCreateLink = async () => {
    try {
      const res = await createAccountLink();
      if (res?.accountLink?.url) {
        window.location.href = res.accountLink.url;
      } else {
        console.error("No account link URL found");
      }
    } catch (err) {
      console.error("Error creating account:", err);
    }
  };

  useEffect(() => {
    handleCreateLink();
  }, []);

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <h1>Redirecting to Stripe...</h1>
    </div>
  );
}
