"use client";

import { InterestedContractorsService } from "@/app/lib/services/interestedContractors";
import type {
  ContractorFilters,
  CreateContractorRequest,
  InterestedContractor,
  UpdateContractorRequest,
  ContractorStats,
} from "@/app/lib/types/interestedContractors";
import { useCallback, useEffect, useState } from "react";

interface UseContractorInterestOptions {
  initialPageSize?: number;
  accessToken?: string;
}

export function useContractorInterest(
  options: UseContractorInterestOptions = {}
) {
  const { initialPageSize = 20, accessToken } = options;

  // State
  const [contractors, setContractors] = useState<InterestedContractor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ContractorStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

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
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const statsData = await InterestedContractorsService.getContractorStats(
        accessToken
      );
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
      // Don't set error state for stats, as it's not critical
    } finally {
      setIsStatsLoading(false);
    }
  }, [accessToken]);

  // Fetch contractors
  const fetchContractors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Only send supported parameters to the API
      const params = {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch || undefined,
        emailStatus:
          filters.emailStatus !== "all"
            ? (filters.emailStatus as "sent" | "not_sent" | "failed")
            : undefined,
        status:
          filters.status !== "all"
            ? (filters.status as
                | "waitingForResponse"
                | "interested"
                | "notInterested"
                | "registered")
            : undefined,
        assignedAdmin:
          filters.assignedAdmin !== "all"
            ? (filters.assignedAdmin as "assigned" | "unassigned")
            : undefined,
        dateFrom: filters.dateFrom?.toISOString(),
        dateTo: filters.dateTo?.toISOString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      const response = await InterestedContractorsService.getContractors(
        params,
        accessToken
      );

      setContractors(response.contractors as InterestedContractor[]);
      setTotalPages(response.pagination.totalPages);
      setTotalContractors(response.pagination.total);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch contractors"
      );
      setContractors([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    debouncedSearch,
    filters.emailStatus,
    filters.status,
    filters.assignedAdmin,
    filters.dateFrom,
    filters.dateTo,
    filters.sortBy,
    filters.sortOrder,
    accessToken,
  ]);

  // Effects
  useEffect(() => {
    fetchContractors();
  }, [fetchContractors]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [
    debouncedSearch,
    filters.emailStatus,
    filters.status,
    filters.assignedAdmin,
    filters.dateFrom,
    filters.dateTo,
    filters.sortBy,
    filters.sortOrder,
    accessToken,
  ]);

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
    fetchStats(); // Also refresh statistics
  }, [fetchContractors, fetchStats]);

  // CRUD operations
  const createContractor = useCallback(
    async (data: CreateContractorRequest) => {
      try {
        await InterestedContractorsService.createContractor(data, accessToken);
        refreshContractors();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create contractor";
        return { success: false, error: message };
      }
    },
    [refreshContractors, accessToken]
  );

  const updateContractor = useCallback(
    async (id: string, data: UpdateContractorRequest) => {
      try {
        await InterestedContractorsService.updateContractor(
          id,
          data,
          accessToken
        );
        refreshContractors();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update contractor";
        return { success: false, error: message };
      }
    },
    [refreshContractors, accessToken]
  );

  const deleteContractor = useCallback(
    async (id: string) => {
      try {
        await InterestedContractorsService.deleteContractor(id, accessToken);
        refreshContractors();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete contractor";
        return { success: false, error: message };
      }
    },
    [refreshContractors, accessToken]
  );

  const sendWelcomeEmails = useCallback(async () => {
    try {
      const result = await InterestedContractorsService.sendWelcomeEmails(
        accessToken
      );
      refreshContractors();
      return { success: true, result };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send welcome emails";
      return { success: false, error: message };
    }
  }, [refreshContractors, accessToken]);

  const retryWelcomeEmail = useCallback(
    async (contractorId: string) => {
      try {
        const result = await InterestedContractorsService.retryWelcomeEmail(
          contractorId,
          accessToken
        );
        refreshContractors();
        return { success: true, result };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to retry welcome email";
        return { success: false, error: message };
      }
    },
    [refreshContractors, accessToken]
  );

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
    stats,
    isStatsLoading,

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
