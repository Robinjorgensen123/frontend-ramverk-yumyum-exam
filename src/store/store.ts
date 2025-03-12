import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../features/menu/menuSlice"
import apiKeyReducer from "../features/apiKey/apiKeySlice"
import cartReducer from "../features/cart/cartSlice"
import uiReducer from "../features/Ui/UiSlice"
import etaReducer from "../features/Eta/EtaSlice"
import tenantReducer from "../features/Tenant/TenantSlice"
import orderReducer from "../features//order/orderSlice"
import recieptReducer from "../features/receipt/receiptSlice"

const store = configureStore({
  reducer: {
    menu: menuReducer, // lägger till menuSlice globalt i store
    apikey: apiKeyReducer,
    cart: cartReducer,
    eta: etaReducer,
    tenant: tenantReducer,
    ui: uiReducer,
    order: orderReducer,
    reciept: recieptReducer,
    
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch