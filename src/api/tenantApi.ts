import { API_BASE_URL } from "../../src/features/apiKey/apiConfig";

export const registerTenantApi = async (tenantName: string, apiKey: string) => {
    if (!apiKey) throw new Error("API-nyckel saknas!");
    if (!tenantName) throw new Error("Tenant-namn saknas!");

    const response = await fetch(`${API_BASE_URL}/tenants`, {
        method: "POST",
        headers: {
            "x-zocom": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tenantName }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Misslyckades med att registrera Tenant: ${errorText}`);
    }

    return response.json(); // Returnerar tenant-id
};
