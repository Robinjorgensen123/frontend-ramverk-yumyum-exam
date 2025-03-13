import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

// Definiera typer
interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
  type?: string;
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
    },
    setReceiptData: (state, action) => {
      state.receiptId = action.payload.id;
      state.items = action.payload.items || [];
      state.orderValue = action.payload.orderValue;
      state.timestamp = action.payload.timestamp;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

// Exportera actions och reducer
export const { clearReceipt, setReceiptData, setLoading, setError } = receiptSlice.actions;
export const selectReceipt = (state: RootState) => state.receipt; // Valfritt: selector

export default receiptSlice.reducer;
