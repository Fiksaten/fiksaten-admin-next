import { 
  sendWelcomeEmailsToContractors,
  getInterestedContractors,
  createInterestedContractor,
  updateInterestedContractor,
  deleteInterestedContractor,
  postByIdRetryWelcomeEmail
} from "../openapi-client";
import type {
  CreateContractorRequest,
  UpdateContractorRequest,
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
  static async getContractors(params: GetContractorsParams = {}, accessToken?: string) {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const query: Record<string, string> = {};
    
    if (params.page) query.page = params.page.toString();
    if (params.limit) query.limit = params.limit.toString();
    if (params.search) query.search = params.search;
    if (params.emailStatus) query.emailStatus = params.emailStatus;

    const response = await getInterestedContractors({
      query,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to fetch contractors");
    }

    return response.data;
  }

  /**
   * Create a new interested contractor
   */
  static async createContractor(data: CreateContractorRequest, accessToken?: string) {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await createInterestedContractor({
      body: data,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to create contractor");
    }

    return response.data;
  }

  /**
   * Update an interested contractor
   */
  static async updateContractor(id: string, data: UpdateContractorRequest, accessToken?: string){
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await updateInterestedContractor({
      path: { id },
      body: data,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to update contractor");
    }

    return response.data;
  }

  /**
   * Delete an interested contractor
   */
  static async deleteContractor(id: string, accessToken?: string): Promise<void> {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await deleteInterestedContractor({
      path: { id },
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to delete contractor");
    }
  }

  /**
   * Send welcome emails to contractors who haven't received them
   */
  static async sendWelcomeEmails(accessToken?: string) {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await sendWelcomeEmailsToContractors({
      body: {}, // Send empty body to satisfy API schema
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if(response.error) {
      throw new Error(response.error.message || "Failed to send welcome emails");
    }

    return response.data;
  }

  /**
   * Send welcome emails to specific contractors by ID
   */
  static async sendWelcomeEmailsToContractors(contractorIds: string[], accessToken?: string) {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await sendWelcomeEmailsToContractors({
      body: { contractorIds },
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to send welcome emails");
    }

    return response.data;
  }

  /**
   * Retry sending welcome email to a specific contractor
   */
  static async retryWelcomeEmail(contractorId: string, accessToken?: string) {
    const token = resolveToken(accessToken);
    if (!token) throw new Error("No access token available");

    const response = await postByIdRetryWelcomeEmail({
      path: { id: contractorId },
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to retry welcome email");
    }

    return response.data;
  }
}