// src/features/receipt/receiptSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../apiKey/apiConfig";
import { RootState } from "../../store/store";

// Definiera typer
interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
  type?: string;
  [key: string]: any;
}

interface ReceiptState {
  receiptId: string | null;
  items: OrderItem[];
  orderValue: number | null;
  timestamp: string | null;
  loading: boolean;
  error: string | null;
}

// Definiera initial state
const initialState: ReceiptState = {
  receiptId: null,
  items: [],
  orderValue: null,
  timestamp: null,
  loading: false,
  error: null
};

// Definiera async thunk för att hämta kvitto
export const fetchReceipt = createAsyncThunk<
  any,
  string,
  { state: RootState }
>(
  "receipt/fetchReceipt",
  async (orderId, { getState }) => {
    const apiKey = getState().apikey.key;
    const tenantId = getState().tenant.tenantId || localStorage.getItem("tenantId");
    
    if (!apiKey) throw new Error("API-nyckel saknas");
    if (!tenantId) throw new Error("Tenant ID saknas");
    if (!orderId) throw new Error("Order ID saknas");
    
    // Försök först med kvitto-endpointen
    try {
      const response = await fetch(`${API_BASE_URL}/receipts/${orderId}`, {
        method: "GET",
        headers: {
          "x-zocom": apiKey,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      // Om kvitto-endpointen misslyckas, prova order-endpointen som fallback
      const orderResponse = await fetch(`${API_BASE_URL}/${tenantId}/orders/${orderId}`, {
        method: "GET",
        headers: {
          "x-zocom": apiKey,
          "Content-Type": "application/json"
        }
      });
      
      if (!orderResponse.ok) {
        throw new Error(`Failed to fetch order: ${orderResponse.status}`);
      }
      
      const orderData = await orderResponse.json();
      return orderData.order || orderData;
    } catch (error: any) {
      console.error("Fel vid hämtning av kvitto:", error.message);
      throw error;
    }
  }
);

// Skapa slice
const receiptSlice = createSlice({
  name: "receipt",
  initialState,
  reducers: {
    clearReceipt: (state) => {
      state.receiptId = null;
      state.items = [];
      state.orderValue = null;
      state.timestamp = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.receiptId = action.payload.id;
        state.items = action.payload.items || [];
        state.orderValue = action.payload.orderValue;
        state.timestamp = action.payload.timestamp;
      })
      .addCase(fetchReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Ett fel inträffade";
      });
  }
});

// Exportera actions och reducer
export const { clearReceipt } = receiptSlice.actions;
export default receiptSlice.reducer;
