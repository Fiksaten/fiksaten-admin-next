import {
  getCategories as getCategoriesApi,
  addCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  updateCategory as updateCategoryApi,
} from "../openapi-client";
import { CreateCategoryBody } from "../types/categoryTypes";
import { resolveToken } from "./util";

const getCategories = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getCategoriesApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const createCategory = async (
  accessToken: string | undefined,
  category: CreateCategoryBody
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await createCategoryApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: category,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const updateCategory = async (
  accessToken: string | undefined,
  categoryId: string,
  category: CreateCategoryBody
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await updateCategoryApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      id: categoryId,
    },
    body: category,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const deleteCategory = async (
  accessToken: string | undefined,
  categoryId: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await deleteCategoryApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      categoryId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export { getCategories, createCategory, updateCategory, deleteCategory };
