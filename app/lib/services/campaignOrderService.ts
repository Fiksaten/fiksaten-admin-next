import {
  getAllCampaignOrders as getAllCampaignOrdersApi,
  updateCampaignOrder as updateCampaignOrderApi,
} from "../openapi-client";
import { resolveToken } from "./util";
import type {
  GetAllCampaignOrdersResponses,
  UpdateCampaignOrderData,
} from "../openapi-client";

const getAllCampaignOrders = async (
  accessToken?: string
): Promise<GetAllCampaignOrdersResponses[200]> => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getAllCampaignOrdersApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const updateCampaignOrder = async (
  accessToken: string,
  orderId: string,
  updateData: UpdateCampaignOrderData["body"]
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await updateCampaignOrderApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: { orderId },
    body: updateData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getAllCampaignOrders, updateCampaignOrder };
