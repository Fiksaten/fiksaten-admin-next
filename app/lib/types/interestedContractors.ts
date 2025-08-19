// Types for Interested Contractors management

export interface InterestedContractor {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  businessId: string | null;
  website: string | null;
  status: "waitingForResponse" | "interested" | "notInterested" | "registered";
  welcomeEmailSent: boolean;
  welcomeEmailSentAt: string | null;
  welcomeEmailError: string | null;
  notes: string | null;
  assignedAdminId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContractorFilters {
  search: string;
  emailStatus: string;
  status: string;
  assignedAdmin: string;
}

export interface ContractorListResponse {
  contractors: InterestedContractor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateContractorRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  businessId?: string;
  website?: string;
  status?: "waitingForResponse" | "interested" | "notInterested" | "registered";
  notes?: string;
  assignedAdminId?: string; // Use undefined for unassigned, or admin UUID
}

export interface UpdateContractorRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  businessId?: string;
  website?: string;
  status?: "waitingForResponse" | "interested" | "notInterested" | "registered";
  notes?: string;
  assignedAdminId?: string; // Use undefined for unassigned, or admin UUID
}

export interface EmailSendingResult {
  sent: number;
  failed: number;
  errors: Array<{
    contractorId: string;
    email: string;
    error: string;
  }>;
}