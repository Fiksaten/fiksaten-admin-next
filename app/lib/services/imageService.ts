import {
  addCategoryImage,
  getImagePublicUrl,
  getSignedUrl as getSignedUrlApi,
} from "../openapi-client";
import { resolveToken } from "./util";

const getSignedUrl = async (accessToken: string | undefined) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getSignedUrlApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const uploadImage = async (accessToken: string | undefined, file: File) => {
  const signedUrlData = await getSignedUrl(accessToken);

  const signedUrl = signedUrlData.signedUrl;

  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }
  const json = await uploadResponse.json();
  const imageUrlRes = await getImagePublicUrl({
    path: { imageKey: json.Key },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (imageUrlRes.error) {
    throw new Error(imageUrlRes.error.message);
  }

  return { imageKey: json.Key, imageUrl: imageUrlRes.data.imageUrl };
};

const updateCategoryImage = async (
  accessToken: string | undefined,
  imageKey: string,
  categoryId: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await addCategoryImage({
    path: { categoryId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      imageKey: imageKey,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getSignedUrl, uploadImage, updateCategoryImage };
