import {
  GetCustomerServiceTicketsResponses,
  AddCustomerServiceTicketMessageData,
} from "../openapi-client";

type SupportTicketListItem =
  GetCustomerServiceTicketsResponses["200"]["tickets"][number];
type SupportTicketList = GetCustomerServiceTicketsResponses["200"];
type SupportTicketMessageBody = NonNullable<
  AddCustomerServiceTicketMessageData["body"]
>;
// The single ticket type is unknown in OpenAPI, so we use any for now
// You can refine this if you know the backend structure
// type SupportTicket = ...

export type {
  SupportTicketListItem,
  SupportTicketList,
  SupportTicketMessageBody,
};

export enum SupportTicketStatus {
  OPEN = "open",
  PENDING = "pending",
  CLOSED = "closed",
}

export interface SupportTicketResponse {
  id: string;
  ticketId: string;
  responderName: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  userId: string;
  userName: string;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  responses: SupportTicketResponse[];
}
