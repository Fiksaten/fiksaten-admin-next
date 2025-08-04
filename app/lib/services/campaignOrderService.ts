import {
  getAllCampaignOrders as getAllCampaignOrdersApi,
  updateCampaignOrder as updateCampaignOrderApi,
} from "../openapi-client";
import { resolveToken } from "./util";

const getAllCampaignOrders = async (accessToken?: string) => {
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
  updateData: {
    status: "pending" | "accepted" | "declined" | "done";
    chosenDay?: string;
    chosenStartTime?: string;
    contractorId?: string;
  }
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
