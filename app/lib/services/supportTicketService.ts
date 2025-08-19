import {
  getCustomerServiceTickets,
  getCustomerServiceTicket,
  addCustomerServiceTicketMessage,
  updateCustomerServiceTicket as updateCustomerServiceTicketApi,
  updateCustomerServiceTicketStatus as updateCustomerServiceTicketStatusApi,
  UpdateCustomerServiceTicketData,
  updateCustomerServiceTicketPriority as updateCustomerServiceTicketPriorityApi,
  updateCustomerServiceTicketCategory as updateCustomerServiceTicketCategoryApi,
} from "../openapi-client";
import { resolveToken } from "./util";

const getSupportTickets = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await getCustomerServiceTickets({
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

const getSupportTicket = async (
  accessToken: string | undefined,
  id: string
) => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await getCustomerServiceTicket({
    headers: { Authorization: `Bearer ${token}` },
    path: { id },
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

const respondToSupportTicket = async (
  accessToken: string | undefined,
  id: string,
  message: string
) => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await addCustomerServiceTicketMessage({
    headers: { Authorization: `Bearer ${token}` },
    path: { id },
    body: { message },
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

const updateCustomerServiceTicket = async (
  accessToken: string | undefined,
  id: string,
  content: UpdateCustomerServiceTicketData["body"]
) => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await updateCustomerServiceTicketApi({
    headers: { Authorization: `Bearer ${token}` },
    path: { ticketId: id },
    body: content
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

const updateCustomerServiceTicketStatus = async (
  accessToken: string | undefined,
  id: string,
  status: "pending" | "seen" | "answered" | "resolved" | "closed",
  assignToMe: boolean
) => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await updateCustomerServiceTicketStatusApi({
    headers: { Authorization: `Bearer ${token}` },
    path: { id },
    body: {
      status,
      assignToMe,
    },
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

const changeTicketPriority = async (
  accessToken: string | undefined,
  id: string,
  priority: "urgent" | "high" | "normal" | "low"
) => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await updateCustomerServiceTicketPriorityApi({
    headers: { Authorization: `Bearer ${token}` },
    path: { id },
    body: { priority },
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

const changeTicketCategory = async (  
  accessToken: string | undefined,
  id: string,
  category: "technical" | "billing" | "general" | "bug_report"
) => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await updateCustomerServiceTicketCategoryApi({
    headers: { Authorization: `Bearer ${token}` },
    path: { id },
    body: { category },
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

export {
  getSupportTickets,
  getSupportTicket,
  respondToSupportTicket,
  updateCustomerServiceTicket,
  updateCustomerServiceTicketStatus,
  changeTicketPriority,
  changeTicketCategory,
};
