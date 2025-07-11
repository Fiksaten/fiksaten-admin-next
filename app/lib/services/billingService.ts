import { createStripeAccountLink } from "@/app/lib/openapi-client";
import { getServerAccessToken } from "@/app/lib/serverAuth";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const createAccountLink = async () => {
  const accessToken = await getServerAccessToken();
  if (!accessToken) {
    throw new Error("No access token available in createAccountLink");
  }
  const response = await createStripeAccountLink({
    baseUrl: `${baseUrl}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data;
};

export { createAccountLink };
