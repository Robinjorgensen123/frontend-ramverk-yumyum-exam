import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../apiKey/apiConfig";
import { RootState } from "../../store/store";

interface TenantState {
    tenantId: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: TenantState = {
    tenantId: localStorage.getItem("tenantId"),  // Hämta från localStorage vid start
    loading: false,
    error: null,
};

export const registerTenant = createAsyncThunk<
    string, 
    string, 
    { state: RootState; rejectValue: string }
>(
    "tenant/registerTenant",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const apiKey = state.apikey.key;
            const existingTenant = localStorage.getItem("tenantId"); // Kolla localStorage först

            if (!apiKey) {
                console.error("API-nyckel saknas");
                return rejectWithValue("API-nyckel saknas");
            }

            if (existingTenant) {
                console.log(" Tenant finns redan i localStorage:", existingTenant);
                return existingTenant;
            }

            // Generera ett dynamiskt namn istället för "zocom"
            const tenantName = `tenant-${Math.random().toString(36).substring(7)}`;
            console.log("🔼 Skickar ny tenant:", tenantName);

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
                throw new Error(`Misslyckades med att registrera Tenant (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            console.log("✅ Tenant registrerad:", data.id);

            // Spara Tenant ID i localStorage
            localStorage.setItem("tenantId", data.id);

            return data.id;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Ett fel inträffade");
        }
    }
);

const tenantSlice = createSlice({
    name: "tenant",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerTenant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerTenant.fulfilled, (state, action) => {
                state.loading = false;
                state.tenantId = action.payload;
            })
            .addCase(registerTenant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default tenantSlice.reducer;
