"use server";

import { buildApiUrl } from "./utils";
import { DashboardStatsResponse } from "./types";
import { Chat } from "@/components/CustomerServiceChat";
import { cookies } from "next/headers";
import { CreateCategory } from "../admin/dashboard/settings/categories/category-form";

export async function getIdToken(): Promise<string> {
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

export const getContractorCategories = async () => {
  const token = await getIdToken();
  try {
    const response = await fetch(buildApiUrl("/contractors/me/categories"), {
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
    const response = await fetch(buildApiUrl("/categories/create"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return { message: "Ok" }
  } catch (e) {
    console.error(e);
    return { message: "Error" }
  }
};

export const updateCategory = async (category: CreateCategory, id: string) => {
  const idToken = await getIdToken();
  try {
    const response = await fetch(buildApiUrl(`/categories/update/${id}`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return { message: "Ok" }
  } catch (e) {
    console.error(e);
    return { message: "Error" }
  }
};

export const deleteCategory = async (id: string) => {
  const idToken = await getIdToken();
  try {
    const response = await fetch(buildApiUrl(`/categories/delete/${id}`), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return { message: "Ok" }
  } catch (e) {
    console.error(e);
    return { message: "Error" }
  }
};



export const getUser = async (id: string) => {
  const token = await getIdToken();
  try {
    const response = await fetch(buildApiUrl(`/users/${id}`), {
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
}

export const getUserOrders = async (id: string, page = 1, limit = 5) => {
  const token = await getIdToken();
  try {
    const response = await fetch(buildApiUrl(`/users/orders/${id}?page=${page}&limit=${limit}`), {
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

export const getContractorReports = async () => {
  const token = await getIdToken();
  try {
    const response = await fetch(buildApiUrl("/contractors/me/metrics"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

export const getContractorData = async (idToken: string) => {
  const response = await fetch(buildApiUrl("/contractors/me"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(await response.json());
  }
  return await response.json();
}

export const getContractorReviews = async (idToken: string) => {
  const response = await fetch(buildApiUrl("/contractors/me/reviews"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(await response.json());
  }
  return await response.json();
}


