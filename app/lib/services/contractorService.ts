import Cookies from "js-cookie";
import { getaccessToken } from "../actions";
import {
  ContractorJoinRequestData,
  GetCurrentContractorDataResponse,
  UpdateCurrentContractorDataData,
  approveContractor as approveContractorApi,
  chooseCategoriesAsContractor,
  declineContractor as declineContractorApi,
  getAllContractorJoinRequests as getAllContractorJoinRequestsApi,
  getAllContractors as getAllContractorsApi,
  getContractor as getContractorDataApi,
  getContractorDetails as getContractorDetailsApi,
  getCurrentContractorData as getCurrentContractorDataApi,
  contractorJoinRequest as requestJoinContractorApi,
  updateCurrentContractorData as updateCurrentContractorDataApi,
} from "../openapi-client";
import { resolveToken } from "./util";

type ContractorUpdateBody = NonNullable<UpdateCurrentContractorDataData["body"]>;
type ContractorJoinRequestBody = NonNullable<ContractorJoinRequestData["body"]>;
type CurrentContractorResponse = GetCurrentContractorDataResponse;

const approveContractor = async (
  accessToken: string | undefined,
  contractorId: string
) => {
  const token =
    accessToken ??
    (typeof window === "undefined"
      ? getaccessToken()
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
  contractorId: string
) => {
  const token = resolveToken(accessToken);
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
  categoryIds: string[]
) => {
  const token = resolveToken(accessToken);
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
  const token = resolveToken(accessToken);
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
  const token = resolveToken(accessToken);
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
  const token = resolveToken(accessToken);
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
  contractorId: string
) => {
  const token = resolveToken(accessToken);
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
  const token = resolveToken(accessToken);
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
  return res.data as CurrentContractorResponse;
};

const getAllContractors = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getAllContractorsApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getContractorDetails = async (accessToken: string, contractorId: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getContractorDetailsApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      contractorId,
    },
  });
  console.log(res);
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export {
  approveContractor, chooseCategories, declineContractor, getAllContractorJoinRequests, getAllContractors, getContractorData, getContractorDetails, getCurrentContractorData, requestJoinContractor, updateCurrentContractorData
};

