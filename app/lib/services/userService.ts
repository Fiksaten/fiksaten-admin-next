import {
  RequestAccountDeletionData,
  UpdateCurrentUserData,
  getAllUsers as getAllUsersApi,
  getCurrentUser as getCurrentUserApi,
  getUserById as getUserByIdApi,
  requestAccountDeletion as requestAccountDeletionApi,
  updateCurrentUser,
} from "../openapi-client";
import { resolveToken } from "./util";

type UserUpdateBody = UpdateCurrentUserData["body"];
type RequestAccountDeletionBody = RequestAccountDeletionData["body"];

const updateUser = async (
  accessToken: string | undefined,
  userData: UserUpdateBody,
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await updateCurrentUser({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: userData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const requestAccountDeletion = async (
  accessToken: string | undefined,
  userData: RequestAccountDeletionBody
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await requestAccountDeletionApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: userData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getAllUsers = async (
  accessToken: string | undefined,
  limit?: number,
  page?: number,
  search?: string
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getAllUsersApi({
    query: {
      limit,
      page,
      search,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getUserById = async (accessToken: string | undefined, userId: string) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getUserByIdApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      id: userId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getCurrentUser = async (accessToken: string | undefined) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getCurrentUserApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getAllUsers, getCurrentUser, getUserById, requestAccountDeletion, updateUser };

