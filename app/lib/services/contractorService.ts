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

const approveContractor = async (accessToken: string, contractorId: string) => {
  const res = await approveContractorApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

const declineContractor = async (accessToken: string, contractorId: string) => {
  const res = await declineContractorApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

const chooseCategories = async (accessToken: string, categoryIds: string[]) => {
  const res = await chooseCategoriesAsContractor({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
  accessToken: string,
  contractorData: ContractorUpdateBody
) => {
  const res = await updateCurrentContractorDataApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: contractorData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const requestJoinContractor = async (
  accessToken: string,
  contractorData: ContractorJoinRequestBody
) => {
  const res = await requestJoinContractorApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: contractorData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getAllContractorJoinRequests = async (accessToken: string) => {
  const res = await getAllContractorJoinRequestsApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getContractorData = async (accessToken: string, contractorId: string) => {
  const res = await getContractorDataApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

const getCurrentContractorData = async (accessToken: string) => {
  const res = await getCurrentContractorDataApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
