import { API_BASE_URL } from "../../src/features/apiKey/apiConfig";

export const fetchMenuApi = async (apiKey: string) => {
    if (!apiKey) throw new Error("API Key saknas!");

    const response = await fetch(`${API_BASE_URL}/menu`, {
        method: "GET",
        headers: {
            "x-zocom": apiKey,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Misslyckades med att hämta menyn");
    }

    return response.json(); // Returnerar menydata
};
