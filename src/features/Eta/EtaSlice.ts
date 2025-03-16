// EtaSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { API_BASE_URL } from "../../features/apiKey/apiConfig";

interface EtaState {
    orderNumber: string | null;
    eta: string | null;
    state: string | null;
    items: any[]; // Lägg till items
    orderValue: number | null; // Lägg till orderValue
    loading: boolean;
    error: string | null;
}

const initialState: EtaState = {
    orderNumber: null,
    eta: null,
    state: null,
    items: [], // Lägg till tom array
    orderValue: null, // Lägg till null
    loading: false,
    error: null,
};

export const fetchEta = createAsyncThunk<
    { 
        orderNumber: string; 
        eta: string | null; 
        state: string;
        items: any[];
        orderValue: number;
    },
    { tenantId: string; orderId: string },
    { state: RootState; rejectValue: string }
>(
    "eta/fetchEta",
    async ({ tenantId, orderId }, { getState, rejectWithValue }) => {
        try {
            const state = getState(); //  hämta state härifrån!
            const apiKey = state.apikey.key;

            if (!apiKey) return rejectWithValue("API-nyckel saknas!");

            const response = await fetch(`${API_BASE_URL}/${tenantId}/orders/${orderId}`, {
                headers: {
                    "x-zocom": apiKey as string,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Fel vid hämtning av ETA:", errorText);
                throw new Error(errorText);
            }

            const data = await response.json();
            console.log(" ETA API-svar:", data);

            return {
                orderNumber: data.order.id,
                eta: data.order.eta || null,
                state: data.order.state, // Viktigt för att veta om ordern är klar!
                items: data.order.items || [], // Lägg till denna rad
                orderValue: data.order.orderValue || 0 // Lägg till denna rad
            };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Ett oväntat fel inträffade");
        }
    }
);

const etaSlice = createSlice({
    name: "eta",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEta.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEta.fulfilled, (state, action) => {
                state.loading = false;
                state.orderNumber = action.payload.orderNumber;
                state.eta = action.payload.eta || null;
                state.state = action.payload.state; //  Sparar även status!
                state.items = action.payload.items || [];
                state.orderValue = action.payload.orderValue || 0;
            })
            .addCase(fetchEta.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ett fel inträffade";
            });
    },
});

export default etaSlice.reducer;
