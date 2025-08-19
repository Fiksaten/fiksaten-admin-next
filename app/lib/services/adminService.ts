import { resolveToken } from "./util";
import { getAllAdmins as getAllAdminsApi } from "../openapi-client";

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
