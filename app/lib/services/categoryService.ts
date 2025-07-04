import {
  getCategories as getCategoriesApi,
  addCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
} from "../openapi-client";
import { CreateCategoryBody } from "../types/categoryTypes";

const getCategories = async (accessToken: string) => {
  const res = await getCategoriesApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const createCategory = async (
  accessToken: string,
  category: CreateCategoryBody
) => {
  const res = await createCategoryApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: category,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const deleteCategory = async (accessToken: string, categoryId: string) => {
  const res = await deleteCategoryApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

export { getCategories, createCategory, deleteCategory };
