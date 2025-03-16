import { API_BASE_URL } from "../../src/features/apiKey/apiConfig";

export const fetchEtaApi = async (tenantId: string, orderId: string, apiKey: string) => {
    if (!apiKey) throw new Error("API-nyckel saknas!");
    if (!tenantId) throw new Error("Tenant ID saknas!");
    if (!orderId) throw new Error("Order ID saknas!");

    const url = `${API_BASE_URL}/${tenantId}/orders/${orderId}`;

    console.log("🔍 API-anrop till ETA:", { url, apiKey, tenantId, orderId });

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "x-zocom": apiKey, //  Skickar api nyckel
            "Content-Type": "application/json",
        },
    });

    console.log(" API-svar status:", response.status);
    if (!response.ok) {
        const errorText = await response.text();
        console.error(" Misslyckades att hämta ETA:", errorText);
        throw new Error(`Misslyckades att hämta ETA: ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response (ETA):", data);

    return {
        orderNumber: data.order?.id || null,
        eta: data.order?.eta || null,
    };
};
