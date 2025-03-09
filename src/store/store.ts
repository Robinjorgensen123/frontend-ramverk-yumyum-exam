import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../features/menu/menuSlice"
import apiKeyReducer from "../features/apiKey/apiKeySlice"

const store = configureStore({
  reducer: {
    menu: menuReducer, // lägger till menuSlice globalt i store
    apikey: apiKeyReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch