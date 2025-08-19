"use client";

import { useState, useMemo, useCallback } from "react";
import { AdminTicketDashboard } from "@/app/(dashboards)/admin/support-tickets/AdminTicketDashboard";
import { GetCustomerServiceTicketsResponse } from "@/app/lib/openapi-client";
import { Admin } from "@/app/lib/services/adminService";

interface TicketFilters {
  status: string;
  category: string;
  priority: string;
  userType: string;
  assignedTo: string;
  search: string;
}

interface SupportTicketsContainerProps {
  ticketsResponse: GetCustomerServiceTicketsResponse;
  admins: Admin[];
}

const ITEMS_PER_PAGE = 20;

export default function SupportTicketsContainer({
  ticketsResponse,
  admins,
}: SupportTicketsContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TicketFilters>({
    status: "all",
    category: "all",
    priority: "all",
    userType: "all",
    assignedTo: "all",
    search: "",
  });

  const filteredTickets = useMemo(() => {
    return ticketsResponse.tickets.filter((ticket) => {
      if (filters.status !== "all" && ticket.status !== filters.status)
        return false;

      if (filters.category !== "all" && ticket.category !== filters.category)
        return false;

      if (filters.priority !== "all" && ticket.priority !== filters.priority)
        return false;

      if (filters.userType !== "all" && ticket.user.role !== filters.userType)
        return false;

      if (filters.assignedTo === "assigned" && !ticket.assignedAdminId)
        return false;
      if (filters.assignedTo === "unassigned" && ticket.assignedAdminId)
        return false;
      if (filters.assignedTo !== "all" && 
          filters.assignedTo !== "assigned" && 
          filters.assignedTo !== "unassigned" && 
          ticket.assignedAdminId !== filters.assignedTo)
        return false;

      if (filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          ticket.content,
          ticket.user.email,
          ticket.user.firstname,
          ticket.user.lastname,
          ticket.id,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(searchTerm)) return false;
      }

      return true;
    });
  }, [ticketsResponse, filters]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);

  const handleFilterChange = useCallback((newFilters: TicketFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <AdminTicketDashboard
      ticketsResponse={{
        ...ticketsResponse,
        tickets: filteredTickets
      }}
      admins={admins}
      filters={filters}
      onFilterChange={handleFilterChange}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
