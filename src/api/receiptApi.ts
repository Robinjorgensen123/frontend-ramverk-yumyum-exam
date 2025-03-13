import { API_BASE_URL } from "../features/apiKey/apiConfig";

export const fetchReceiptApi = async (orderId: string, apiKey: string) => {
    if (!apiKey) throw new Error("❌ API-nyckel saknas!");
    if (!orderId) throw new Error("❌ Order ID saknas!");

    const tenantId = localStorage.getItem("tenantid")
    if (!tenantId) throw new Error("tenant id sakans")

        const url = `${API_BASE_URL}/${tenantId}/orders/${orderId}`;
    /* const url = `${API_BASE_URL}/receipts/${orderId}`; */
    console.log("🔵 API-anrop till Receipt:", { url, apiKey, orderId });

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-zocom": apiKey,
                "Content-Type": "application/json",
            },
        });

        console.log("📊 API-svar status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("🔴 Misslyckades att hämta kvittot:", errorText, response.status);
            throw new Error(`Misslyckades att hämta kvitto:${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("🟢 Fullständig API-respons för Receipt:", data);

        const orderData = data.order || data

        // Enligt dokumentationen returneras kvittot direkt, inte i en "receipt" wrapper
        return {
            receiptId: orderData.id,
            orderValue: orderData.orderValue,
            items: orderData.items || [],
            timestamp: orderData.timestamp,
        };
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error("🔴 Nätverksfel vid hämtning av kvitto:", error);
            throw new Error("Kunde inte ansluta till servern. Kontrollera din internetanslutning.");
        }
        console.error("🔴 Fel vid hämtning av kvitto:", error);
        throw error;
    }
}

   