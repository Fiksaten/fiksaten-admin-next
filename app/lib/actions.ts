"use server";

import { buildApiUrl } from "./utils";
import { DashboardStatsResponse } from "./types";
import { Chat } from "@/components/CustomerServiceChat";
import { cookies } from "next/headers";
import { CreateCategory } from "../dashboard/settings/categories/category-form";

async function getIdToken(): Promise<string> {
  const cookieStore = cookies();
  const token = cookieStore.get("idToken");

  if (!token) {
    throw new Error("No token found");
  }

  return token.value;
}

export const getReports = async () => {
  const token = await getIdToken();
  const response = await fetch(buildApiUrl("/admin/metrics"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }
  return (await response.json()) as DashboardStatsResponse;
};

export const getChats = async () => {
  const token = await getIdToken();
  const response = await fetch(buildApiUrl("/chats/customer-service/all"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }
  return (await response.json()) as Chat[];
};

export const getUsers = async (limit = 20, page = 1, search: string) => {
  const token = await getIdToken();
  try {
    const response = await fetch(
      buildApiUrl(
        `/admin/users/all/?page=${page}&limit=${limit}&search=${search}`
      ),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getCategories = async () => {
  const token = await getIdToken();
  try {
    const response = await fetch(buildApiUrl(`/categories/all`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};


export const createCategory = async (category: CreateCategory) => {
  const idToken = await getIdToken();
  try {
    const response = await postCategory(category, idToken);
    return {
      message: response
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message)
  }
}

export const editClaim = async (_: any, formData: FormData) => {
  const idToken = await getIdToken();
  const claim = await parseFormData(formData);

  console.log('editClaim - start - data = %j', claim);
  try {
    await updateClaim(claim, idToken);
    revalidatePath('/claims', 'page');
    return {
      message: claim.claim_uuid
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const removeClaim = async (claimId: string) => {
  const idToken = await getIdToken();
  console.log('removeClaim - start - data = %j', { claimId });
  await deleteClaim(claimId, idToken);
  return {
    message: 'Claim removed'
  }
}