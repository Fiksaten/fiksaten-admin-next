import { createStripeAccountLink } from "@/app/lib/openapi-client";
import Cookies from "js-cookie";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const createAccountLink = async () => {
  const accessToken = Cookies.get("accessToken");
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
