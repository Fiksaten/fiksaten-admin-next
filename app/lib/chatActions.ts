import { getIdToken } from "./actions"
import { buildApiUrl } from "./utils"

export const getNonAdminChats = async () => {
    const idToken = await getIdToken()
    const response = await fetch(buildApiUrl("/chats"), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
        },
    })
    if (!response.ok) {
        throw new Error("Failed to fetch chats")
    }
    return await response.json()
}

