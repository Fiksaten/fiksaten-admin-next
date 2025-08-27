import { getAllAdmins as getAllAdminsApi } from "../openapi-client";
import { client as openapiClient } from "../openapi-client/client.gen";
import { resolveToken } from "./util";

export interface Admin {
  id: string;
  firstname: string | null; // Can be null in database
  lastname: string | null;  // Can be null in database
  email: string;
  role: string;
}

export class AdminService {
  /**
   * Get all admin users
   */
  static async getAllAdmins(accessToken?: string) {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await getAllAdminsApi({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }
}


export type UsersInsights = {
  totals: {
    total: number;
    admins: number;
    contractors: number;
    consumers: number;
    activeThisMonth: number;
  };
  growthLast12: Array<{ month: string; count: number }>;
  roleBreakdown: Array<{ role: string; count: number }>;
  topEmailsByActivity: Array<{ email: string | null; actions: number }>;
};

export const getUsersInsights = async (
  accessToken?: string,
): Promise<UsersInsights> => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await openapiClient.get<UsersInsights, unknown>({
    url: "/admin/users/insights",
    headers: { Authorization: `Bearer ${token}` },
  });
  if ((res as any).error) {
    throw new Error((res as any).error.message ?? "Failed to fetch insights");
  }
  return (res as any).data ?? (res as any);
};
