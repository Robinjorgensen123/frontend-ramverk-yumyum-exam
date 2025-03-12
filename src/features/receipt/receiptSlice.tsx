import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReceiptApi } from "../../api/receiptApi";
import { RootState } from "../../store/store";

interface ReceiptItem {
    id: string
    name: string
    price: number
}


interface ReceiptState {
    receiptId: string | null;
    orderValue: number | null;
    items: ReceiptItem[]
    timestamp: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: ReceiptState = {
    receiptId: null,
    orderValue: null,
    items: [],
    timestamp: null,
    loading: false,
    error: null,
};

//  Thunk för att hämta kvitto
export const fetchReceipt = createAsyncThunk<
    { receiptId: string; orderValue: number; items: any[]; timestamp: string },
    { tenantId: string; receiptId: string },
    { state: RootState; rejectValue: string }
>(
    "receipt/fetchReceipt",
    async ({ tenantId, receiptId }, { getState, rejectWithValue }) => {
        try {
            const apiKey = getState().apikey.key;

            if (!apiKey) return rejectWithValue("API-nyckel saknas!");
            if (!tenantId) return rejectWithValue("Tenant ID saknas!");
            if (!receiptId) return rejectWithValue("Receipt ID saknas!");

            return await fetchReceiptApi(tenantId, receiptId, apiKey);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Ett oväntat fel inträffade");
        }
    }
);

// ✅ Skapa `receiptSlice`
const receiptSlice = createSlice({
    name: "receipt",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReceipt.fulfilled, (state, action) => {
                state.loading = false;
                state.receiptId = action.payload.receiptId;
                state.orderValue = action.payload.orderValue;
                state.items = action.payload.items;
                state.timestamp = action.payload.timestamp;
            })
            .addCase(fetchReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Ett fel inträffade";
            });
    },
});

export default receiptSlice.reducer;
