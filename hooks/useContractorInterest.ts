"use client";

import { useState, useCallback, useEffect } from "react";
import { InterestedContractorsService } from "@/app/lib/services/interestedContractors";
import type {
  InterestedContractor,
  ContractorFilters,
  CreateContractorRequest,
  UpdateContractorRequest,
} from "@/app/lib/types/interestedContractors";

interface UseContractorInterestOptions {
  initialPageSize?: number;
  accessToken?: string;
}

export function useContractorInterest(options: UseContractorInterestOptions = {}) {
  const { initialPageSize = 20, accessToken } = options;

  // State
  const [contractors, setContractors] = useState<InterestedContractor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContractors, setTotalContractors] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Filter state
  const [filters, setFilters] = useState<ContractorFilters>({
    search: "",
    emailStatus: "all",
    status: "all",
    assignedAdmin: "all",
  });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch contractors
  const fetchContractors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch || undefined,
        emailStatus: filters.emailStatus !== "all" ? filters.emailStatus as "sent" | "not_sent" | "failed" : undefined,
        status: filters.status !== "all" ? filters.status as "interested" | "registered" | "waitingForResponse" : undefined,
        assignedAdmin: filters.assignedAdmin !== "all" ? filters.assignedAdmin as "all" | "assigned" | "unassigned" : undefined,
      };

      const response = await InterestedContractorsService.getContractors(params, accessToken);
      
      setContractors(response.contractors as InterestedContractor[]);
      setTotalPages(response.pagination.totalPages);
      setTotalContractors(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contractors");
      setContractors([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filters.emailStatus, filters.status, filters.assignedAdmin, accessToken]);

  // Effects
  useEffect(() => {
    fetchContractors();
  }, [fetchContractors]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, filters.emailStatus, filters.status, filters.assignedAdmin, accessToken, currentPage]);

  // Handlers
  const handleFilterChange = useCallback((newFilters: ContractorFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const refreshContractors = useCallback(() => {
    fetchContractors();
  }, [fetchContractors]);

  // CRUD operations
  const createContractor = useCallback(async (data: CreateContractorRequest) => {
    try {
      await InterestedContractorsService.createContractor(data, accessToken);
      refreshContractors();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create contractor";
      return { success: false, error: message };
    }
  }, [refreshContractors, accessToken]);

  const updateContractor = useCallback(async (id: string, data: UpdateContractorRequest) => {
    try {
      await InterestedContractorsService.updateContractor(id, data, accessToken);
      refreshContractors();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update contractor";
      return { success: false, error: message };
    }
  }, [refreshContractors, accessToken]);

  const deleteContractor = useCallback(async (id: string) => {
    try {
      await InterestedContractorsService.deleteContractor(id, accessToken);
      refreshContractors();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete contractor";
      return { success: false, error: message };
    }
  }, [refreshContractors, accessToken]);

  const sendWelcomeEmails = useCallback(async () => {
    try {
      const result = await InterestedContractorsService.sendWelcomeEmails(accessToken);
      refreshContractors();
      return { success: true, result };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send welcome emails";
      return { success: false, error: message };
    }
  }, [refreshContractors, accessToken]);

  const retryWelcomeEmail = useCallback(async (contractorId: string) => {
    try {
      const result = await InterestedContractorsService.retryWelcomeEmail(contractorId, accessToken);
      refreshContractors();
      return { success: true, result };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to retry welcome email";
      return { success: false, error: message };
    }
  }, [refreshContractors, accessToken]);

  return {
    // State
    contractors,
    totalContractors,
    isLoading,
    error,
    currentPage,
    totalPages,
    pageSize,
    filters,
    
    // Handlers
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    refreshContractors,
    
    // CRUD operations
    createContractor,
    updateContractor,
    deleteContractor,
    
    // Email operations
    sendWelcomeEmails,
    retryWelcomeEmail,
  };
}