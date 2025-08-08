// Types for Interested Contractors management

export interface InterestedContractor {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  welcomeEmailSent: boolean;
  welcomeEmailSentAt: string | null;
  welcomeEmailError: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContractorFilters {
  search: string;
  emailStatus: string;
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
  notes?: string;
}

export interface UpdateContractorRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  notes?: string;
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