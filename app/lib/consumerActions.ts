import { getIdToken } from "./actions";
import { buildApiUrl } from "./utils";

export const getLatestOrders = async () => {
    const token = await getIdToken();
    const url = buildApiUrl(`/orders/latest`);
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch latest orders");
    }
    return await response.json();
};

export const getOwnOrders = async () => {
    const token = await getIdToken();
    const url = buildApiUrl(`/orders/my`);
    const response = await fetch(url, {
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

export const getOrderById = async (id: string) => {
    const token = await getIdToken();
    const url = buildApiUrl(`/orders/${id}?includeOffers=true`);
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch order by id");
    }
    return await response.json();
};