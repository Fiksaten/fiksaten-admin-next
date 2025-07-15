import { getSignedUrl as getSignedUrlApi } from "../openapi-client";
import { resolveToken } from "./util";

const getSignedUrl = async (
  accessToken: string | undefined,
  fileType: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getSignedUrlApi({
    query: {
      fileType: fileType,
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

// Enhanced wrapper for upload flow
const getUploadUrlAndImageUrl = async (
  accessToken: string | undefined,
  fileType: string
) => {
  const signedUrlData = await getSignedUrl(accessToken, fileType);

  // Extract the base URL from the signed URL to construct the final image URL
  // The signed URL contains query parameters for uploading, but the final image URL is just the base URL
  const signedUrl = signedUrlData.url;
  const baseUrl = signedUrl.split("?")[0]; // Remove query parameters

  return {
    signedUrl,
    imageUrl: baseUrl,
  };
};

export { getSignedUrl, getUploadUrlAndImageUrl };
