//EtaSlice:
//Hämtar Eta & ordernummber (GET /orders({orderId})

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchEtaApi } from "../../api/etaAPI"; // ✅ Använder API-funktionen
import { RootState } from "../../store/store";

interface EtaState {
    orderNumber: string | null
    eta: string | null
    loading: boolean
    error: string | null
}

const initialState: EtaState = {
    orderNumber: null,
    eta: null,
    loading: false,
    error: null,
};

// ✅ Thunk för att hämta ETA för en befintlig order
export const fetchEta = createAsyncThunk<
    { orderNumber: string; eta: string | null}, 
    { tenantId: string; orderId: string }, 
    { state: RootState; rejectValue: string }
>(
    "eta/fetchEta",
    async ({ tenantId, orderId }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const apiKey = state.apikey.key;

            if (!apiKey) return rejectWithValue("API-nyckel saknas!");
            if (!tenantId) return rejectWithValue("Tenant ID saknas!");
            if (!orderId) return rejectWithValue("Order ID saknas!");

            const { orderNumber, eta } = await fetchEtaApi(tenantId, orderId, apiKey); // ✅ Använder API-funktionen
            return { orderNumber, eta}
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Ett oväntat fel inträffade");
        }
    }
);

// ✅ Skapa etaSlice
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
                state.orderNumber = action.payload.orderNumber
                state.eta = action.payload.eta || null // ✅ Sparar endast ETA
            })
            .addCase(fetchEta.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Ett fel inträffade";
            });
    },
});

export default etaSlice.reducer;
