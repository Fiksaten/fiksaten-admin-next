import { getSignedUrl as getSignedUrlApi } from "../openapi-client";

const getSignedUrl = async (
  accessToken: string,
  fileType: string,
  fileName: string
) => {
  const res = await getSignedUrlApi({
    query: {
      fileType: fileType,
      fileName: fileName,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getSignedUrl };
