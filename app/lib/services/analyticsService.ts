import { getAdminAnalytics as getAdminAnalyticsApi } from "../openapi-client";
import { resolveToken } from "./util";

const getAdminAnalytics = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }

  const res = await getAdminAnalyticsApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }

  return res.data;
};

export { getAdminAnalytics };
