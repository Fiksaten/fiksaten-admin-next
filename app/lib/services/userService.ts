import {
  updateCurrentUser,
  requestAccountDeletion as requestAccountDeletionApi,
  getAllUsers as getAllUsersApi,
  getUserById as getUserByIdApi,
} from "../openapi-client";
import { RequestAccountDeletionBody, UserUpdateBody } from "../types/userTypes";
import { resolveToken } from "./util";

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

export { updateUser, requestAccountDeletion, getAllUsers, getUserById };
