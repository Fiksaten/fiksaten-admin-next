import { getaccessToken } from "./actions";
import { ExtendedOrder } from "./types";
import { buildApiUrl } from "./utils";

export type Sort =
  | "newest_date"
  | "oldest_date"
  | "smallest_budget"
  | "biggest_budget";

export enum Status {
  OPEN = "open",
  IN_PROGRESS = "inprogress",
  SENT = "sent",
  HISTORY = "history",
}

export interface OrdersResponse {
  orders: ExtendedOrder[];
  totalCount: number;
}

export const getPaginatedOrders = async (
  status: Status,
  page: number,
  limit: number,
  nameFilter?: string,
  sort?: Sort
) => {
  const token = await getaccessToken();
  const url = buildApiUrl(
    `/orders/contractor/${status}?page=${page}&limit=${limit}&nameFilter=${nameFilter}&sort=${sort}`
  );
  console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return await response.json();
};

export const getOwnOrders = async () => {
  const token = await getaccessToken();
  const response = await fetch(buildApiUrl("/contractors/orders/my"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch own orders");
  }
  return await response.json();
};

export const fetchOfferDetails = async (orderId: string, token: string) => {
  const response = await fetch(
    buildApiUrl(`/contractors/me/offers/${orderId}`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch offer details");
  }
  const json = await response.json();
  return json.offers;
};
