import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../apiKey/apiConfig";

// Lägg till import för RootState om du inte redan har det
import { RootState } from "../../store/store";

// Lägg till typerna för placeOrder
export const placeOrder = createAsyncThunk<any, void, { state: RootState }>(
  "order/placeOrder", 
  async (_, { getState }) => {
    const cart = getState().cart.items;
    const tenantId = getState().tenant.tenantId || localStorage.getItem("tenantId");
    const apiKey = getState().apikey.key;

    if (!tenantId) throw new Error("Tenant ID saknas");
    if (!apiKey) throw new Error("API-nyckel saknas");

    const requestBody = JSON.stringify({
      items: cart.map(item => item.id)
    });

    console.log("Skickar order till API:", { tenantId, items: cart.map(item => item.id) });

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
        throw new Error(`API Error: ${data.message || "Unknown error"}`);
      }

      console.log("API Order Response:", data); 
      return data.order; 

    } catch (error: any) { // Explicit typning av error
      console.error("Fetch Error:", error.message);
      throw error;
    }
  }
);

// Lägg till typerna för fetchOrderDetails
export const fetchOrderDetails = createAsyncThunk<any, string, { state: RootState }>(
  "order/fetchDetails", 
  async (orderId, { getState }) => {
    const tenantId = getState().tenant.tenantId || localStorage.getItem("tenantId");
    const apiKey = getState().apikey.key;

    if (!tenantId) throw new Error("Tenant ID saknas");
    if (!apiKey) throw new Error("API-nyckel saknas");
    if (!orderId) throw new Error("Order ID saknas");

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
        throw new Error(`Failed to fetch order: ${response.status}`);
      }

      const data = await response.json();
      console.log("Order details:", data);
      return data.order || data;
    } catch (error: any) { // Explicit typning av error
      console.error("Fel vid hämtning av orderdetaljer:", error.message);
      throw error;
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: { 
    orderId: null, 
    eta: null, 
    status: "idle",
    orderDetails: null,
    loading: false,
    error: null as string | null
  },
  reducers: {},
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
        state.error = action.error?.message || "Ett fel inträffade";
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
        state.error = action.error?.message || "Ett fel inträffade";
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
