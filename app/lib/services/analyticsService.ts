import { getLandingPageAnalytics as getLandingPageAnalyticsApi } from "../openapi-client";
import { LandingPageAnalytics } from "../types/analyticsTypes";
import { resolveToken } from "./util";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const analyticsCache = new Map<string, CacheEntry<unknown>>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const getLandingPageAnalytics = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const cached = analyticsCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data as LandingPageAnalytics;
  }
  const res = await getLandingPageAnalyticsApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  analyticsCache.set(token, { data: res.data, timestamp: Date.now() });
  return res.data as LandingPageAnalytics;
};

export { getLandingPageAnalytics };
