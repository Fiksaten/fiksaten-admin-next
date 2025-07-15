"use client";

import { useState, useMemo, useCallback } from "react";
import { AdminTicketDashboard } from "@/components/AdminTicketDashboard";
import { AdminTicketDetail } from "@/components/AdminTicketDetail";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import {
  respondToSupportTicket,
  updateCustomerServiceTicket,
} from "@/app/lib/services/supportTicketService";
import { GetCustomerServiceTicketsResponse } from "@/app/lib/openapi-client";

// Transform the existing ticket type to match our enhanced interface
interface EnhancedTicket {
  id: string;
  userId: string;
  content: string;
  category: "technical" | "billing" | "general" | "bug_report";
  priority: "low" | "normal" | "high" | "urgent";
  status: "pending" | "seen" | "answered" | "resolved" | "closed";
  assignedAdminId: string | null;
  userTimezone: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    email: string;
    phoneNumber: string | null;
    role: "consumer" | "contractor";
  };
  messages: Array<{
    id: string;
    customerServiceTicketId: string;
    message: string;
    sender: "user" | "admin";
    senderUserId: string;
    senderName: string;
    createdAt: string;
    updatedAt: string;
    localTimestamp: string;
    isFromCurrentUser: boolean;
  }>;
  isArchived: boolean;
  lastActivityAt: string;
  unreadCount: number;
}

interface TicketFilters {
  status: string;
  category: string;
  priority: string;
  userType: string;
  assignedTo: string;
  search: string;
}

interface SupportTicketsContainerProps {
  initialTickets: GetCustomerServiceTicketsResponse;
  accessToken: string;
}

const ITEMS_PER_PAGE = 20;

export default function SupportTicketsContainer({
  initialTickets,
  accessToken,
}: SupportTicketsContainerProps) {
  const { user } = useAuth();
  const [tickets, setTickets] =
    useState<GetCustomerServiceTicketsResponse>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<EnhancedTicket | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TicketFilters>({
    status: "all",
    category: "all",
    priority: "all",
    userType: "all",
    assignedTo: "all",
    search: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Transform tickets to enhanced format
  const enhancedTickets: EnhancedTicket[] = useMemo(() => {
    // Handle case where tickets might be an object with a tickets property or an array
    const ticketsArray = Array.isArray(tickets)
      ? tickets
      : tickets?.tickets || [];

    return ticketsArray.map((ticket) => {
      const now = new Date();
      const createdDate = new Date(ticket.createdAt);
      const daysDiff = Math.floor(
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Parse content to extract category and priority if stored as JSON
      let category: "technical" | "billing" | "general" | "bug_report" =
        "general";
      let priority: "low" | "normal" | "high" | "urgent" = "normal";

      try {
        const parsed = JSON.parse(ticket.content);
        if (parsed.category) category = parsed.category;
        if (parsed.priority) priority = parsed.priority;
      } catch {
        // Content is plain text, use defaults
      }

      // Ensure status is one of the expected values
      const validStatuses = [
        "pending",
        "seen",
        "answered",
        "resolved",
        "closed",
      ] as const;
      const status = validStatuses.includes(ticket.status as any)
        ? (ticket.status as
            | "pending"
            | "seen"
            | "answered"
            | "resolved"
            | "closed")
        : "pending";

      const enhancedMessages = ticket.messages.map((msg: any) => ({
        ...msg,
        sender: "user" as "user" | "admin", // Default to user, should be enhanced in API
        senderUserId: ticket.userId,
        senderName:
          `${ticket.user.firstname} ${ticket.user.lastname}`.trim() || "User",
        localTimestamp: new Date(msg.createdAt).toLocaleString(),
        isFromCurrentUser: false,
      }));

      return {
        ...ticket,
        category,
        priority,
        status,
        userTimezone: "UTC", // Default timezone, should be enhanced in API
        user: {
          ...ticket.user,
          role: (ticket.user.role as "consumer" | "contractor") || "consumer",
        },
        messages: enhancedMessages,
        isArchived:
          daysDiff > 30 || status === "resolved" || status === "closed",
        lastActivityAt:
          ticket.messages.length > 0
            ? ticket.messages[ticket.messages.length - 1].createdAt
            : ticket.updatedAt,
        unreadCount: 0, // Would need to be calculated based on admin read status
      };
    });
  }, [tickets]);

  // Filter and paginate tickets
  const filteredTickets = useMemo(() => {
    return enhancedTickets.filter((ticket) => {
      // Status filter
      if (filters.status !== "all" && ticket.status !== filters.status)
        return false;

      // Category filter
      if (filters.category !== "all" && ticket.category !== filters.category)
        return false;

      // Priority filter
      if (filters.priority !== "all" && ticket.priority !== filters.priority)
        return false;

      // User type filter
      if (filters.userType !== "all" && ticket.user.role !== filters.userType)
        return false;

      // Assignment filter
      if (filters.assignedTo === "assigned" && !ticket.assignedAdminId)
        return false;
      if (filters.assignedTo === "unassigned" && ticket.assignedAdminId)
        return false;

      // Search filter
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
  }, [enhancedTickets, filters]);

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);

  // Mock available admins - in real implementation, this would come from API
  const availableAdmins = [
    {
      id: user?.id || "current-admin",
      name: `${user?.firstname} ${user?.lastname}`.trim() || "Current Admin",
    },
    { id: "admin-1", name: "Admin User 1" },
    { id: "admin-2", name: "Admin User 2" },
  ];

  const handleFilterChange = useCallback((newFilters: TicketFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleTicketSelect = useCallback((ticket: any) => {
    // For now, use the modal approach. In production, you might want to navigate to /admin/support-tickets/[id]
    setSelectedTicket(ticket);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedTicket(null);
  }, []);

  const handleReply = useCallback(
    async (message: string) => {
      if (!selectedTicket) return;

      setIsLoading(true);
      try {
        await respondToSupportTicket(accessToken, selectedTicket.id, message);

        // Update local state
        const newMessage = {
          id: `temp-${Date.now()}`,
          customerServiceTicketId: selectedTicket.id,
          message,
          sender: "admin" as const,
          senderUserId: user?.id || "admin",
          senderName: `${user?.firstname} ${user?.lastname}`.trim() || "Admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          localTimestamp: new Date().toLocaleString(),
          isFromCurrentUser: true,
        };

        setSelectedTicket((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, newMessage],
                lastActivityAt: new Date().toISOString(),
              }
            : null
        );

        setTickets((prev: any) => {
          const prevArray = Array.isArray(prev) ? prev : prev?.tickets || [];
          const updatedArray = prevArray.map((t: any) =>
            t.id === selectedTicket.id
              ? {
                  ...t,
                  messages: [
                    ...t.messages,
                    {
                      id: newMessage.id,
                      customerServiceTicketId: selectedTicket.id,
                      message,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : t
          );
          return Array.isArray(prev)
            ? updatedArray
            : { ...prev, tickets: updatedArray };
        });

        toast({
          title: "Reply sent",
          description: "Your reply has been sent to the customer.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send reply. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTicket, accessToken, user]
  );

  const handleStatusChange = useCallback(
    async (status: "pending" | "seen" | "answered" | "resolved" | "closed") => {
      if (!selectedTicket) return;

      setIsLoading(true);
      try {
        await updateCustomerServiceTicket(
          accessToken,
          selectedTicket.id,
          status as "pending" | "seen" | "answered",
          selectedTicket.assignedAdminId
        );

        // Update local state
        setSelectedTicket((prev) => (prev ? { ...prev, status } : null));
        setTickets((prev: any) => {
          const prevArray = Array.isArray(prev) ? prev : prev?.tickets || [];
          const updatedArray = prevArray.map((t: any) =>
            t.id === selectedTicket.id ? { ...t, status } : t
          );
          return Array.isArray(prev)
            ? updatedArray
            : { ...prev, tickets: updatedArray };
        });

        toast({
          title: "Status updated",
          description: `Ticket status changed to ${status}.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTicket, accessToken]
  );

  const handleAssign = useCallback(
    async (adminId: string | null) => {
      if (!selectedTicket) return;

      setIsLoading(true);
      try {
        await updateCustomerServiceTicket(
          accessToken,
          selectedTicket.id,
          selectedTicket.status as "pending" | "seen" | "answered",
          adminId
        );

        // Update local state
        setSelectedTicket((prev) =>
          prev ? { ...prev, assignedAdminId: adminId } : null
        );
        setTickets((prev: any) => {
          const prevArray = Array.isArray(prev) ? prev : prev?.tickets || [];
          const updatedArray = prevArray.map((t: any) =>
            t.id === selectedTicket.id ? { ...t, assignedAdminId: adminId } : t
          );
          return Array.isArray(prev)
            ? updatedArray
            : { ...prev, tickets: updatedArray };
        });

        toast({
          title: adminId ? "Ticket assigned" : "Ticket unassigned",
          description: adminId
            ? `Ticket assigned to ${
                availableAdmins.find((a) => a.id === adminId)?.name || "admin"
              }.`
            : "Ticket has been unassigned.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update assignment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTicket, accessToken, availableAdmins]
  );

  if (selectedTicket) {
    return (
      <AdminTicketDetail
        ticket={selectedTicket}
        messages={selectedTicket.messages}
        onReply={handleReply}
        onStatusChange={handleStatusChange}
        onAssign={handleAssign}
        onBack={handleBack}
        currentAdminId={user?.id || "current-admin"}
        availableAdmins={availableAdmins}
        isLoading={isLoading}
      />
    );
  }

  return (
    <AdminTicketDashboard
      tickets={paginatedTickets}
      filters={filters}
      onFilterChange={handleFilterChange}
      onTicketSelect={handleTicketSelect}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      isLoading={isLoading}
    />
  );
}
