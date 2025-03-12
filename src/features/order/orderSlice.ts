// orderSlice:
// skickar en beställning (POST /orders)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../features/apiKey/apiConfig";
import { RootState } from "../../store/store";

interface OrderState {
    orderNumber: string | null;
    eta: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orderNumber: null,
    eta: null,
    loading: false,
    error: null,
};

// **Thunk för att skapa en beställning**
export const placeOrder = createAsyncThunk<
    { orderNumber: string; eta: string }, 
    { tenantId: string; items: string[] }, 
    { state: RootState; rejectValue: string }
>(
    "order/placeOrder",
    async ({ tenantId, items }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const apiKey = state.apikey.key;

            if (!apiKey) return rejectWithValue("API-nyckel saknas!");
            if (!tenantId) return rejectWithValue("Tenant ID saknas! Registrera en Tenant först.");
            if (items.length === 0) return rejectWithValue("Varukorgen är tom!");

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
                return rejectWithValue(`Misslyckades att skapa order: ${errorText}`);
            }

            const data = await response.json();
            console.log("✅ Order skickad:", data);

            return {
                orderNumber: data.order.id,
                eta: data.order.eta,
            };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Ett fel inträffade");
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderNumber = action.payload.orderNumber;
                state.eta = action.payload.eta;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Ett fel inträffade";
            });
    },
});

export default orderSlice.reducer;
