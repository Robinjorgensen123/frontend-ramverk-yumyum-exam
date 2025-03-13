import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../apiKey/apiConfig";
import { RootState } from "../../store/store";

interface OrderState {
  orderId: string | null;
  eta: string | null;
  status: string;
  orderDetails: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderId: null,
  eta: null,
  status: "idle",
  orderDetails: null,
  loading: false,
  error: null
};

export const placeOrder = createAsyncThunk<
  any,
  { tenantId: string; items: string[] },
  { state: RootState; rejectValue: string }
>(
  "order/placeOrder",
  async ({ tenantId, items }, { getState, rejectWithValue }) => {
    const apiKey = getState().apikey.key;

    if (!apiKey) return rejectWithValue("API-nyckel saknas");
    if (!tenantId) return rejectWithValue("Tenant ID saknas");
    if (items.length === 0) return rejectWithValue("Varukorgen är tom");

    const requestBody = JSON.stringify({
      items: items
    });

    console.log("Skickar order till API:", { tenantId, items: items });

    try {
      const response = await fetch(`${API_BASE_URL}/${tenantId}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-zocom": apiKey,
        },
        body: requestBody,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data); 
        return rejectWithValue(`API Error: ${data.message || "Unknown error"}`);
      }

      console.log("API Order Response:", data); 
      return data.order;

    } catch (error: any) {
      console.error("Fetch Error:", error.message);
      return rejectWithValue(error instanceof Error ? error.message : "Ett oväntat fel inträffade");
    }
  }
);

export const fetchOrderDetails = createAsyncThunk<
  any,
  string,
  { state: RootState; rejectValue: string }
>(
  "order/fetchDetails",
  async (orderId, { getState, rejectWithValue }) => {
    const tenantId = getState().tenant.tenantId || localStorage.getItem("tenantId");
    const apiKey = getState().apikey.key;

    if (!apiKey) return rejectWithValue("API-nyckel saknas");
    if (!tenantId) return rejectWithValue("Tenant ID saknas");
    if (!orderId) return rejectWithValue("Order ID saknas");

    console.log("Hämtar orderdetaljer:", { tenantId, orderId });

    try {
      const response = await fetch(`${API_BASE_URL}/${tenantId}/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-zocom": apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Fel vid hämtning av order (${response.status}):`, errorText);
        return rejectWithValue(`Failed to fetch order: ${response.status}`);
      }

      const data = await response.json();
      console.log("Order details:", data);
      return data.order || data;
    } catch (error: any) {
      console.error("Fel vid hämtning av orderdetaljer:", error.message);
      return rejectWithValue(error instanceof Error ? error.message : "Ett oväntat fel inträffade");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderId = null;
      state.eta = null;
      state.orderDetails = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Hantera placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        console.log("Order Sparad:", action.payload);
        state.orderId = action.payload.id;
        state.eta = action.payload.eta;
        state.status = "success";
        state.loading = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.loading = false;
      })
      
      // Hantera fetchOrderDetails
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.orderDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
