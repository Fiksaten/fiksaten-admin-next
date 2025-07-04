import {
  approveContractor as approveContractorApi,
  declineContractor as declineContractorApi,
  chooseCategoriesAsContractor,
  updateCurrentContractorData as updateCurrentContractorDataApi,
  contractorJoinRequest as requestJoinContractorApi,
  getAllContractorJoinRequests as getAllContractorJoinRequestsApi,
  getContractor as getContractorDataApi,
  getCurrentContractorData as getCurrentContractorDataApi,
} from "../openapi-client";

import {
  ContractorJoinRequestBody,
  ContractorUpdateBody,
} from "../types/contractorTypes";
import Cookies from "js-cookie";
import { resolveToken } from "./util";

const approveContractor = async (
  accessToken: string | undefined,
  contractorId: string,
) => {
  const token =
    accessToken ??
    (typeof window === "undefined"
      ? getServerAccessToken()
      : Cookies.get("accessToken") || "");
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await approveContractorApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      contractorId: contractorId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const declineContractor = async (
  accessToken: string | undefined,
  contractorId: string,
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await declineContractorApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      contractorId: contractorId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const chooseCategories = async (
  accessToken: string | undefined,
  categoryIds: string[],
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await chooseCategoriesAsContractor({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      categoryIds: categoryIds,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const updateCurrentContractorData = async (
  accessToken: string | undefined,
  contractorData: ContractorUpdateBody
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await updateCurrentContractorDataApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: contractorData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const requestJoinContractor = async (
  accessToken: string | undefined,
  contractorData: ContractorJoinRequestBody
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await requestJoinContractorApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: contractorData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getAllContractorJoinRequests = async (accessToken?: string) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getAllContractorJoinRequestsApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getContractorData = async (
  accessToken: string | undefined,
  contractorId: string,
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getContractorDataApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      contractorId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getCurrentContractorData = async (accessToken?: string) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getCurrentContractorDataApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export {
  approveContractor,
  declineContractor,
  chooseCategories,
  updateCurrentContractorData,
  requestJoinContractor,
  getAllContractorJoinRequests,
  getContractorData,
  getCurrentContractorData,
};
