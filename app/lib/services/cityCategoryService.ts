import {
  getAllCities,
  getCategoriesWithContractorsInCity as getCategoriesWithContractorsInCityApi,
  getCitiesWithContractorsForCategory as getCitiesWithContractorsForCategoryApi,
} from "../openapi-client";
import { resolveToken } from "./util";

const getCities = async (accessToken?: string) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getAllCities({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getCitiesWithContractorsForCategory = async (
  accessToken: string | undefined,
  categoryId: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getCitiesWithContractorsForCategoryApi({
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

const getCategoriesWithContractorsInCity = async (
  accessToken: string | undefined,
  cityId: string
) => {
  const token = resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getCategoriesWithContractorsInCityApi({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    path: {
      cityId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export {
  getCategoriesWithContractorsInCity,
  getCities,
  getCitiesWithContractorsForCategory
};


