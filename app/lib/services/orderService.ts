import {
  getOwnOrders as getOwnOrdersApi,
  removeOrder as removeOrderApi,
  updateOrder as updateOrderApi,
  getOrdersByUserId as getUserOrdersApi,
  getExpressOrdersByUserId as getUserExpressOrdersApi,
} from "../openapi-client";
import { resolveToken } from "./util";

const getOwnOrders = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getOwnOrdersApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data.orders;
};

const removeOrder = async (accessToken: string | undefined, orderId: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await removeOrderApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      orderId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const updateOrder = async (
  accessToken: string | undefined,
  orderId: string,
  body: { status: string; contractorId?: string }
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await updateOrderApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      orderId,
    },
    body,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getUserOrders = async (
  accessToken: string | undefined,
  userId: string,
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getUserOrdersApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      userId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getUserExpressOrders = async (
  accessToken: string | undefined,
  userId: string,
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getUserExpressOrdersApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      userId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export {
  getOwnOrders,
  removeOrder,
  updateOrder,
  getUserOrders,
  getUserExpressOrders,
};
