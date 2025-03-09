
import { API_BASE_URL, getApiKeyFromStorage } from "../features/apiKey/apiConfig";


export const fetchMenu = async () => {
    try {
        const apiKey = getApiKeyFromStorage()
        if (!apiKey) {
            throw new Error("API key missing");
            
        }
   
        const response = await fetch(`${API_BASE_URL}/menu`, {
            method: "GET",
            headers: {
                "x-zocom": apiKey,
                "Content-Type": "application/json",
            }
        })
        if (!response.ok) {
            throw new Error("Failed to fetch menu")
        }
        const menuData = await response.json()
        return menuData
    } catch (error) {
        console.error("Error fetching menu:", error)
    }
}