import { getLandingPageAnalytics as getLandingPageAnalyticsApi } from "../openapi-client";
import { resolveToken } from "./util";

const getLandingPageAnalytics = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getLandingPageAnalyticsApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getLandingPageAnalytics };
