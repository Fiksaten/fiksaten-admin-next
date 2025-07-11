import {
  getCustomerServiceTickets,
  getCustomerServiceTicket,
  addCustomerServiceTicketMessage,
  updateCustomerServiceTicket as updateCustomerServiceTicketApi,
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
  status: "pending" | "seen" | "answered",
  assignedAdminId: string | null
) => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await updateCustomerServiceTicketApi({
    headers: { Authorization: `Bearer ${token}` },
    path: { ticketId: id },
    body: {
      status,
      assignedAdminId,
    },
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
};

export {
  getSupportTickets,
  getSupportTicket,
  respondToSupportTicket,
  updateCustomerServiceTicket,
};
