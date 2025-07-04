import {
  getOwnOrders as getOwnOrdersApi,
  removeOrder as removeOrderApi,
  getOrdersByUserId as getUserOrdersApi,
  getExpressOrdersByUserId as getUserExpressOrdersApi,
} from "../openapi-client";

const getOwnOrders = async (accessToken: string) => {
  const res = await getOwnOrdersApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data.orders;
};

const removeOrder = async (accessToken: string, orderId: string) => {
  const res = await removeOrderApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

const getUserOrders = async (
  accessToken: string,
  userId: string,
  page: number,
  limit: number
) => {
  const res = await getUserOrdersApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
  accessToken: string,
  userId: string,
  page: number,
  limit: number
) => {
  const res = await getUserExpressOrdersApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

export { getOwnOrders, removeOrder, getUserOrders, getUserExpressOrders };
