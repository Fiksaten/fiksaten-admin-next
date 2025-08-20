import {
  sendCustomNotificationToUser,
  sendCustomNotificationToAllUsers,
  sendCustomNotificationToAllConsumers,
  sendCustomNotificationToAllContractors,
  SendCustomNotificationToUserData,
  SendCustomNotificationToAllUsersData,
  SendCustomNotificationToAllConsumersData,
  SendCustomNotificationToAllContractorsData,
} from "../openapi-client";
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

export {
  sendNotificationToUser,
  sendNotificationToAllUsers,
  sendNotificationToAllConsumers,
  sendNotificationToAllContractors,
};
