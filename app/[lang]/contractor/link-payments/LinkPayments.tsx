"use client";
import {
  createAccount,
  createAccountLink,
} from "@/app/lib/services/billingService";
import { Dictionary } from "@/lib/dictionaries";
import { useState } from "react";

export default function StripeConnect({ dict }: { dict: Dictionary }) {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState("");

  const handleCreateAccount = async () => {
    setAccountCreatePending(true);
    setError(false);
    try {
      if (!organizationId) {
        console.error("Organization ID is missing");
        setError(true);
        return;
      }
      const res = await createAccount(organizationId);
      if (res?.id) {
        setConnectedAccountId(res.id);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error creating account:", err);
      setError(true);
    } finally {
      setAccountCreatePending(false);
    }
  };

  const handleCreateAccountLink = async () => {
    if (!connectedAccountId) return;
    setAccountLinkCreatePending(true);
    setError(false);
    try {
      const res = await createAccountLink(connectedAccountId);
      if (res?.accountLink?.url) {
        window.location.href = res.accountLink.url;
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error creating account link:", err);
      setError(true);
    } finally {
      setAccountLinkCreatePending(false);
    }
  };

  const buttonBaseStyle =
    "px-6 py-3 rounded-md text-white font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out";
  const primaryButtonStyle = `${buttonBaseStyle} bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50`;
  const loadingButtonStyle = `${buttonBaseStyle} bg-gray-400 dark:bg-gray-400 cursor-not-allowed`;

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8  p-8 sm:p-10 shadow-lg rounded-xl">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-200 rounded-full mb-4 flex items-center justify-center text-indigo-700 font-bold">
            Y
          </div>
          {!connectedAccountId ? (
            <>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                {dict.contractor.linkPayments.connectStripeAccount}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-white">
                {dict.contractor.linkPayments.connectStripeAccountDescription}
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                {dict.contractor.linkPayments.completeYourAccountSetup}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-white">
                {
                  dict.contractor.linkPayments
                    .completeYourAccountSetupDescription
                }
              </p>
            </>
          )}
        </div>

        <div className="mt-8 space-y-6">
          {!connectedAccountId && (
            <button
              onClick={handleCreateAccount}
              disabled={accountCreatePending}
              className={`${
                accountCreatePending ? loadingButtonStyle : primaryButtonStyle
              } w-full`}
            >
              {accountCreatePending
                ? dict.contractor.linkPayments.creatingAccount
                : dict.contractor.linkPayments.createStripeAccount}
            </button>
          )}

          {connectedAccountId && (
            <button
              onClick={handleCreateAccountLink}
              disabled={accountLinkCreatePending}
              className={`${
                accountLinkCreatePending
                  ? loadingButtonStyle
                  : primaryButtonStyle
              } w-full`}
            >
              {accountLinkCreatePending
                ? dict.contractor.linkPayments.generatingLink
                : dict.contractor.linkPayments.addInformationViaStripe}
            </button>
          )}

          {error && (
            <p className="mt-2 text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">
              {dict.contractor.linkPayments.somethingWentWrong}
            </p>
          )}

          {(connectedAccountId ||
            accountCreatePending ||
            accountLinkCreatePending) && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-sm text-gray-700 space-y-2">
              {connectedAccountId && (
                <p>
                  {dict.contractor.linkPayments.yourConnectedAccountId}
                  <code className="font-mono bg-gray-200 px-1 rounded">
                    {connectedAccountId}
                  </code>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
