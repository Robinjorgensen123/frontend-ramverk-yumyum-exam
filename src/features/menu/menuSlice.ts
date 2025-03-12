//Hämtar menyn från API:et (GET /menu)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMenuApi } from "../../api/menuApi";
import { RootState } from "../../store/store";

// Typ för menyobjekt
export interface MenuItem {
    id: string;
    name: string;
    price: number;
    type: "wonton" | "dip"
    ingredients?: string[]
    
}

// Redux state för meny
 interface MenuState {
    items: MenuItem[];
    loading: boolean;
    error: string | null;
}

// Initialt state
const initialState: MenuState = {
    items: [],
    loading: false,
    error: null,
};

// Async Thunk för att hämta menyn
export const fetchMenu = createAsyncThunk<MenuItem[], void, { state: RootState; rejectValue: string }>(
    "menu/fetchMenu",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState()
            const apiKey = state.apikey.key;

            if (!apiKey) {
                return rejectWithValue("API Key saknas!");
            }

            const data = await fetchMenuApi(apiKey)
            return data.items
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "an unexpected error occured");
        }
    }
);

// MenuSlice
const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload; // sparar menyn i Redux state
            })
            .addCase(fetchMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Error";
            });
    },
});

// Exportera reducer
export default menuSlice.reducer;
