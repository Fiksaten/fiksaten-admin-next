import type {
  GetAllOrdersResponses,
  UpdateOrderData
} from "../openapi-client";
import {
  getAllOrders as getAllOrdersApi,
  getCampaignOrderDetails as getCampaignOrderDetailsApi,
  getExpressOrderDetails as getExpressOrderDetailsApi,
  getOrderDetails as getOrderDetailsApi,
  getOrderImages as getOrderImagesApi,
  getOwnOrders as getOwnOrdersApi,
  getExpressOrdersByUserId as getUserExpressOrdersApi,
  getOrdersByUserId as getUserOrdersApi,
  removeOrder as removeOrderApi,
  updateOrder as updateOrderApi,
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

const removeOrder = async (
  accessToken: string | undefined,
  orderId: string
) => {
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
  body: UpdateOrderData["body"]
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
  userId: string
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
  userId: string
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

const getAllOrders = async (
  accessToken: string | undefined,
  page: number,
  limit: number
): Promise<GetAllOrdersResponses[200]> => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getAllOrdersApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    query: {
      page: page.toString(),
      limit: limit.toString(),
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getOrderDetails = async (
  accessToken: string | undefined,
  orderId: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  try {
    const res = await getOrderDetailsApi({
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
  } catch (error) {
    // If it's a permission error, we'll handle it in the UI
    if (error instanceof Error && error.message.includes("Forbidden")) {
      throw new Error("Admin access required to view this order");
    }
    throw error;
  }
};

const getExpressOrderDetails = async (
  accessToken: string | undefined,
  orderId: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getExpressOrderDetailsApi({
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

const getCampaignOrderDetails = async (
  accessToken: string | undefined,
  orderId: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getCampaignOrderDetailsApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      campaignOrderId: orderId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getOrderImages = async (
  accessToken: string | undefined,
  orderId: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getOrderImagesApi({
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

export {
  getAllOrders, getCampaignOrderDetails, getExpressOrderDetails, getOrderDetails, getOrderImages, getOwnOrders, getUserExpressOrders, getUserOrders, removeOrder,
  updateOrder
};

