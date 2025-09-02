import {
    getAllAvailableAreaRequests as getAllAvailableAreaRequestsApi,
} from "../openapi-client";
import { resolveToken } from "./util";

const getAllAvailableAreaRequests = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getAllAvailableAreaRequestsApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getAllAvailableAreaRequests };
