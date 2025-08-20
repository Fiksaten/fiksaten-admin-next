import { getDeletedUsers as getDeletedUsersApi } from "../openapi-client";
import { GetDeletedUsersResponse } from "../types/deletedUserTypes";
import { resolveToken } from "./util";

const getDeletedUsers = async (
  accessToken: string | undefined,
): Promise<GetDeletedUsersResponse> => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getDeletedUsersApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getDeletedUsers };
