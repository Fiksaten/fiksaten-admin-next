import { getSignedUrl as getSignedUrlApi } from "../openapi-client";
import { resolveToken } from "./util";

const getSignedUrl = async (
  accessToken: string | undefined,
  fileType: string,
  fileName: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getSignedUrlApi({
    query: {
      fileType: fileType,
      fileName: fileName,
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

export { getSignedUrl };
