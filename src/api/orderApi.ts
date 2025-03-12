import { API_BASE_URL } from "../../src/features/apiKey/apiConfig";

export const placeOrderApi = async (tenantId: string, items: string[], apiKey: string) => {
    if (!apiKey) throw new Error("API-nyckel saknas!");
    if (!tenantId) throw new Error("Tenant ID saknas!");
    if (items.length === 0) throw new Error("Varukorgen är tom!");

    const response = await fetch(`${API_BASE_URL}/${tenantId}/orders`, {
        method: "POST",
        headers: {
            "x-zocom": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Misslyckades att skapa order: ${errorText}`);
    }

    return response.json(); // Returnerar JSON-data (order-id, ETA)
};
