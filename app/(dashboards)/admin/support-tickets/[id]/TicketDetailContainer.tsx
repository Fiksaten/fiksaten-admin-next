"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { AdminTicketDetail } from "@/app/(dashboards)/admin/support-tickets/AdminTicketDetail";
import { useAuth } from "@/components/AuthProvider";
import { GetAllAdminsResponse, GetCustomerServiceTicketResponse } from "@/app/lib/openapi-client";

interface TicketDetailContainerProps {
  ticket: GetCustomerServiceTicketResponse;
  accessToken: string;
  admins: GetAllAdminsResponse;
}

export default function TicketDetailContainer({
  ticket: initialTicket,
  admins, 
  accessToken,
}: TicketDetailContainerProps) {
  const { user } = useAuth();
  const [ticket, setTicket] = useState<GetCustomerServiceTicketResponse["ticket"]>(initialTicket.ticket);
  const [messages, setMessages] = useState<GetCustomerServiceTicketResponse["messages"]>(initialTicket.messages);


  if (!ticket) {
    return notFound();
  }

  return (
    <AdminTicketDetail
      ticket={ticket}
      setTicket={setTicket}
      messages={messages}
      setMessages={setMessages}
      currentAdminId={user?.id || "current-admin"}
      accessToken={accessToken}
      admins={admins}
    />
  );
}
