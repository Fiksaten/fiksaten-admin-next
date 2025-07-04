import {
  updateCurrentUser,
  requestAccountDeletion as requestAccountDeletionApi,
  getAllUsers as getAllUsersApi,
  getUserById as getUserByIdApi,
} from "../openapi-client";
import { RequestAccountDeletionBody, UserUpdateBody } from "../types/userTypes";

const updateUser = async (accessToken: string, userData: UserUpdateBody) => {
  const res = await updateCurrentUser({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: userData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const requestAccountDeletion = async (
  accessToken: string,
  userData: RequestAccountDeletionBody
) => {
  const res = await requestAccountDeletionApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: userData,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getAllUsers = async (
  accessToken: string,
  limit?: number,
  page?: number,
  search?: string
) => {
  const res = await getAllUsersApi({
    query: {
      limit,
      page,
      search,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("res", JSON.stringify(res, null, 2));
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getUserById = async (accessToken: string, userId: string) => {
  const res = await getUserByIdApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
