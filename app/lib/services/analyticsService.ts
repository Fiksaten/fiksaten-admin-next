import { getLandingPageAnalytics as getLandingPageAnalyticsApi } from "../openapi-client";

const getLandingPageAnalytics = async (accessToken: string) => {
  const res = await getLandingPageAnalyticsApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getLandingPageAnalytics };
