import { getApiKeyFromStorage } from "../features/apiKey/apiConfig"
import { API_BASE_URL } from "../features/apiKey/apiConfig"

export const fetchTenants = async () => {
    try {
        const apiKey = getApiKeyFromStorage()

        if (!apiKey) {
            throw new Error("ApIkey missing from tenant API")
        }

        const response = await fetch(`${API_BASE_URL}/tenants`, {
            method: "GET",
            headers: {
                "x-zocom": apiKey,
                "Content-Type": "application/json",
            }
        })
        if (!response.ok) {
            throw new Error("Failed to fetch tenants")
        }

        const tenantsData = await response.json()
        return tenantsData
    } catch (error) {
        console.error("Error fetching tenants", error)
    }

}