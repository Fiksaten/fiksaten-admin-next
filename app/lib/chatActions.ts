import { getaccessToken } from "./actions";
import { buildApiUrl } from "./utils";

export const getNonAdminChats = async () => {
  const accessToken = await getaccessToken();
  const response = await fetch(buildApiUrl("/chats"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }
  return await response.json();
};
