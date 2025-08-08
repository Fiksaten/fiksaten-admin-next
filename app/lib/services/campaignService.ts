import {
  getAllCampaigns as getAllCampaignsApi,
  createCampaign as createCampaignApi,
  updateCampaign as updateCampaignApi,
  deleteCampaign as deleteCampaignApi,
  CreateCampaignData,
  UpdateCampaignData,
} from "../openapi-client";
import { resolveToken } from "./util";

const getAllCampaigns = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getAllCampaignsApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const createCampaign = async (
  accessToken: string,
  campaignData: CreateCampaignData["body"]
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await createCampaignApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: campaignData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const updateCampaign = async (
  accessToken: string,
  id: string,
  campaignData: UpdateCampaignData["body"]
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await updateCampaignApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: { id },
    body: campaignData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const deleteCampaign = async (accessToken: string, id: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await deleteCampaignApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: { id },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getAllCampaigns, createCampaign, updateCampaign, deleteCampaign };
