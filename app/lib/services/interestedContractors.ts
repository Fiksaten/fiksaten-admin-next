import type {
  InterestedContractor,
  ContractorListResponse,
  CreateContractorRequest,
  UpdateContractorRequest,
  EmailSendingResult,
} from "../types/interestedContractors";
import { resolveToken } from "./util";

export interface GetContractorsParams {
  page?: number;
  limit?: number;
  search?: string;
  emailStatus?: "sent" | "not_sent" | "failed";
}

export class InterestedContractorsService {
  /**
   * Get paginated list of interested contractors
   */
  static async getContractors(params: GetContractorsParams = {}, accessToken?: string): Promise<ContractorListResponse> {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.emailStatus) searchParams.set("emailStatus", params.emailStatus);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/interested-contractors?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contractors: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new interested contractor
   */
  static async createContractor(data: CreateContractorRequest, accessToken?: string): Promise<InterestedContractor> {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/interested-contractors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create contractor: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update an interested contractor
   */
  static async updateContractor(id: string, data: UpdateContractorRequest, accessToken?: string): Promise<InterestedContractor> {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/interested-contractors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update contractor: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete an interested contractor
   */
  static async deleteContractor(id: string, accessToken?: string): Promise<void> {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/interested-contractors/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete contractor: ${response.statusText}`);
    }
  }

  /**
   * Send welcome emails to contractors who haven't received them
   */
  static async sendWelcomeEmails(accessToken?: string): Promise<EmailSendingResult> {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/interested-contractors/send-welcome-emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to send welcome emails: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Retry sending welcome email to a specific contractor
   */
  static async retryWelcomeEmail(contractorId: string, accessToken?: string): Promise<EmailSendingResult> {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/interested-contractors/${contractorId}/retry-welcome-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to retry welcome email: ${response.statusText}`);
    }

    return response.json();
  }
}