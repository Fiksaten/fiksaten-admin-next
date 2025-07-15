"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminTicketDetail } from "@/components/AdminTicketDetail";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import {
  respondToSupportTicket,
  updateCustomerServiceTicket,
} from "@/app/lib/services/supportTicketService";

// Transform the existing ticket type to match our enhanced interface
interface EnhancedTicket {
  id: string;
  userId: string;
  content: string;
  category: 'technical' | 'billing' | 'general' | 'bug_report';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'seen' | 'answered' | 'resolved' | 'closed';
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
    role: 'consumer' | 'contractor';
  };
  messages: Array<{
    id: string;
    customerServiceTicketId: string;
    message: string;
    sender: 'user' | 'admin';
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

interface TicketDetailContainerProps {
  ticket: any; // The ticket from the API
  accessToken: string;
}

export default function TicketDetailContainer({
  ticket: initialTicket,
  accessToken,
}: TicketDetailContainerProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [ticket, setTicket] = useState(initialTicket);
  const [isLoading, setIsLoading] = useState(false);

  // Transform ticket to enhanced format
  const enhancedTicket: EnhancedTicket = useMemo(() => {
    const now = new Date();
    const createdDate = new Date(ticket.createdAt);
    const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Parse content to extract category and priority if stored as JSON
    let category: 'technical' | 'billing' | 'general' | 'bug_report' = 'general';
    let priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal';
    
    try {
      const parsed = JSON.parse(ticket.content);
      if (parsed.category) category = parsed.category;
      if (parsed.priority) priority = parsed.priority;
    } catch {
      // Content is plain text, use defaults
    }

    const enhancedMessages = ticket.messages.map((msg: any) => ({
      ...msg,
      sender: 'user' as 'user' | 'admin', // Default to user, should be enhanced in API
      senderUserId: ticket.userId,
      senderName: `${ticket.user.firstname} ${ticket.user.lastname}`.trim() || 'User',
      localTimestamp: new Date(msg.createdAt).toLocaleString(),
      isFromCurrentUser: false,
    }));

    return {
      ...ticket,
      category,
      priority,
      userTimezone: 'UTC', // Default timezone, should be enhanced in API
      user: {
        ...ticket.user,
        role: (ticket.user.role as 'consumer' | 'contractor') || 'consumer',
      },
      messages: enhancedMessages,
      isArchived: daysDiff > 30 || ticket.status === 'resolved' || ticket.status === 'closed',
      lastActivityAt: ticket.messages.length > 0 
        ? ticket.messages[ticket.messages.length - 1].createdAt 
        : ticket.updatedAt,
      unreadCount: 0, // Would need to be calculated based on admin read status
    };
  }, [ticket]);

  // Mock available admins - in real implementation, this would come from API
  const availableAdmins = [
    { id: user?.id || 'current-admin', name: `${user?.firstname} ${user?.lastname}`.trim() || 'Current Admin' },
    { id: 'admin-1', name: 'Admin User 1' },
    { id: 'admin-2', name: 'Admin User 2' },
  ];

  const handleBack = useCallback(() => {
    router.push('/admin/support-tickets');
  }, [router]);

  const handleReply = useCallback(async (message: string) => {
    setIsLoading(true);
    try {
      await respondToSupportTicket(accessToken, ticket.id, message);
      
      // Update local state
      const newMessage = {
        id: `temp-${Date.now()}`,
        customerServiceTicketId: ticket.id,
        message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTicket((prev: any) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date().toISOString(),
      }));

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
  }, [ticket.id, accessToken]);

  const handleStatusChange = useCallback(async (status: 'pending' | 'seen' | 'answered' | 'resolved' | 'closed') => {
    setIsLoading(true);
    try {
      await updateCustomerServiceTicket(
        accessToken,
        ticket.id,
        status as "pending" | "seen" | "answered",
        ticket.assignedAdminId
      );

      // Update local state
      setTicket((prev: any) => ({ ...prev, status }));

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
  }, [ticket.id, ticket.assignedAdminId, accessToken]);

  const handleAssign = useCallback(async (adminId: string | null) => {
    setIsLoading(true);
    try {
      await updateCustomerServiceTicket(
        accessToken,
        ticket.id,
        ticket.status as "pending" | "seen" | "answered",
        adminId
      );

      // Update local state
      setTicket((prev: any) => ({ ...prev, assignedAdminId: adminId }));

      toast({
        title: adminId ? "Ticket assigned" : "Ticket unassigned",
        description: adminId 
          ? `Ticket assigned to ${availableAdmins.find(a => a.id === adminId)?.name || 'admin'}.`
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
  }, [ticket.id, ticket.status, accessToken, availableAdmins]);

  return (
    <AdminTicketDetail
      ticket={enhancedTicket}
      messages={enhancedTicket.messages}
      onReply={handleReply}
      onStatusChange={handleStatusChange}
      onAssign={handleAssign}
      onBack={handleBack}
      currentAdminId={user?.id || 'current-admin'}
      availableAdmins={availableAdmins}
      isLoading={isLoading}
    />
  );
}