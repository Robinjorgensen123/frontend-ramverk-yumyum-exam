import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../apiKey/apiConfig";
import { RootState } from "../../store/store";


interface EtaState {
    orderNumber: string | null;
    eta: number | null;
    loading: boolean;
    error: string | null;
}


const initialState: EtaState = {
    orderNumber: null,
    eta: null,
    loading: false,
    error: null,
};

//  Thunk-funktion för att skicka en order och hämta ETA
export const fetchEta = createAsyncThunk<
    { orderNumber: string; eta: number },
    { tenantId: string },                                //  Ingen parameter skickas in
    { state: RootState; rejectValue: string }  //  Vi hämtar state och kan returnera ett error-meddelande
>(
    "eta/fetchEta",
    async ({ tenantId }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const apiKey = state.apikey.key;
            const cartItems = state.cart.items;

            //  Kontrollera att API-nyckel, tenant och varukorg finns
            if (!apiKey) return rejectWithValue("API-nyckel saknas!");
            if (!tenantId) return rejectWithValue("Tenant ID saknas! Registrera en Tenant först.");
            if (cartItems.length === 0) return rejectWithValue("Varukorgen är tom.");

            const orderData = {
                items: cartItems.map((item) => item.id),
            };
            console.log("🔼 Skickar order:", orderData);

            //  Skicka beställning till med tenantId
            const response = await fetch(`${API_BASE_URL}/${tenantId}/orders`, {
                method: "POST",
                headers: {
                    "x-zocom": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                return rejectWithValue(`Misslyckades med att skapa order: ${errorText}`);
            }

            const data = await response.json();
            console.log("✅ Orderbekräftelse:", data);

            return {
                orderNumber: data.order.id,
                eta: data.order.eta,
            };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Ett oväntat fel inträffade");
        }
    }
);

//  Skapa `etaSlice`
const etaSlice = createSlice({
    name: "eta",
    initialState,  //  Använder initialState här!
    reducers: {},  // Ingen vanlig reducer behövs, vi använder bara async-thunks
    extraReducers: (builder) => {
        builder
            .addCase(fetchEta.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEta.fulfilled, (state, action) => {
                state.loading = false;
                state.orderNumber = action.payload.orderNumber;
                state.eta = action.payload.eta;
            })
            .addCase(fetchEta.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Ett fel inträffade";
            });
    },
});

export default etaSlice.reducer;
