import { API_BASE_URL } from "../../src/features/apiKey/apiConfig";

export const fetchReceiptApi = async (tenantId: string, receiptId: string, apiKey: string) => {
    if (!apiKey) throw new Error("API-nyckel saknas!");
    if (!tenantId) throw new Error("Tenant ID saknas!");
    if (!receiptId) throw new Error("Receipt ID saknas!");

    const url = `${API_BASE_URL}/${tenantId}/receipts/${receiptId}`;

    console.log("🔍 API-anrop till Receipt:", { url, apiKey });

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "x-zocom": apiKey, //  Skickar API-nyckeln
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Misslyckades att hämta kvitto:", errorText);
        throw new Error(`Misslyckades att hämta kvitto: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ API Response (Receipt):", data);

    return {
        receiptId: data.receipt.id,
        orderValue: data.receipt.orderValue,
        items: data.receipt.items,
        timestamp: data.receipt.timestamp,
    };
};
