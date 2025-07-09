import {
  getCategories as getCategoriesApi,
  addCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/admin/categories/${categoryId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    }
  );
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText };
    }
    throw new Error(err.message);
  }
  return res.json();
};

const deleteCategory = async (accessToken: string | undefined, categoryId: string) => {
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
