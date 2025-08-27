import {
  SendCustomNotificationToAllConsumersData,
  SendCustomNotificationToAllContractorsData,
  SendCustomNotificationToAllUsersData,
  SendCustomNotificationToUserData,
  sendCustomNotificationToAllConsumers,
  sendCustomNotificationToAllContractors,
  sendCustomNotificationToAllUsers,
  sendCustomNotificationToUser,
} from "../openapi-client";
import { client as openapiClient } from "../openapi-client/client.gen";
import { resolveToken } from "./util";

type SendNotificationToUserBody = SendCustomNotificationToUserData["body"];
type SendNotificationToAllUsersBody = SendCustomNotificationToAllUsersData["body"];
type SendNotificationToAllConsumersBody =
  SendCustomNotificationToAllConsumersData["body"];
type SendNotificationToAllContractorsBody =
  SendCustomNotificationToAllContractorsData["body"];

const sendNotificationToUser = async (
  accessToken: string | undefined,
  notificationData: SendNotificationToUserBody
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await sendCustomNotificationToUser({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: notificationData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const sendNotificationToAllUsers = async (
  accessToken: string | undefined,
  notificationData: SendNotificationToAllUsersBody
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await sendCustomNotificationToAllUsers({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: notificationData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const sendNotificationToAllConsumers = async (
  accessToken: string | undefined,
  notificationData: SendNotificationToAllConsumersBody
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await sendCustomNotificationToAllConsumers({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: notificationData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const sendNotificationToAllContractors = async (
  accessToken: string | undefined,
  notificationData: SendNotificationToAllContractorsBody
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await sendCustomNotificationToAllContractors({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: notificationData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};


type NotificationsInsights = {
  totals: { sent: number; read: number; unread: number; readRate: number };
  byType: Array<{ type: string; sent: number; read: number }>;
  last30Days: Array<{ date: string; sent: number; read: number }>;
  topUsersByUnread: Array<{ userId: string; email: string | null; unread: number }>;
};

const getNotificationsInsights = async (
  accessToken?: string
): Promise<NotificationsInsights> => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");

  const res = await openapiClient.get<NotificationsInsights, unknown>({
    url: "/admin/notifications/insights",
    headers: { Authorization: `Bearer ${token}` },
  });
  if ((res as any).error) {
    throw new Error((res as any).error.message ?? "Failed to fetch insights");
  }
  return (res as any).data ?? (res as any);
};


export {
  getNotificationsInsights, sendNotificationToAllConsumers,
  sendNotificationToAllContractors, sendNotificationToAllUsers, sendNotificationToUser, type NotificationsInsights
};
