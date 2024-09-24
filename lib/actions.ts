import Cookies from "js-cookie"
import { buildApiUrl } from "./utils"
import { DashboardStatsResponse } from "./types"
import { Chat } from "@/components/CustomerServiceChat"

export const getIdTokenFromCookie = async () => {
    const idToken = Cookies.get('idToken')
    if (!idToken) {
        throw new Error('No idToken found in cookie')
    }
    return idToken
}


export const getReports = async () => {
    const token = await getIdTokenFromCookie();
    const response = await fetch(buildApiUrl('/admin/metrics'), {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch reports')
    }
    return await response.json() as DashboardStatsResponse
}

export const getChats = async () => {
    const token = await getIdTokenFromCookie();
    const response = await fetch(buildApiUrl('/chats/customer-service/all'), {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch chats')
    }
    return await response.json() as Chat[]
}