//apiKeySlice:
//Hämtar och lagrar API-Nyckeln (POST /keys)


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../apiKey/apiConfig";

// Hämta API-nyckeln från localStorage
const getApiKeyFromLocalStorage = (): string | null => {
    return localStorage.getItem("apiKey");
};

// Spara API-nyckeln i localStorage
const saveApiKeyToLocalStorage = (apiKey: string) => {
    localStorage.setItem("apiKey", apiKey);
    location.reload(); // laddar om sidan när API-nyckeln har hämtats
};

const initialState = {
    key: getApiKeyFromLocalStorage(),
    loading: false,
    error: null as string | null,
};

// Skapa thunk hämta API-nyckeln
export const fetchApiKey = createAsyncThunk(
    "apikey/fetchApiKey",
    async (_, { rejectWithValue }) => {
        try {
            console.log("Hämtar API-nyckel...");
            const response = await fetch(`${API_BASE_URL}/keys`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Kunde inte hämta API-nyckel.");
            }

            const data = await response.json();
            console.log("API-nyckel hämtad:", data.key);

            saveApiKeyToLocalStorage(data.key); // Spara i localStorage
            return data.key;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Ett oväntat fel inträffade.");
        }
    }
);

// Skapa slice för API-nyckeln
const apiKeySlice = createSlice({
    name: "apiKey",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApiKey.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApiKey.fulfilled, (state, action) => {
                state.loading = false;
                state.key = action.payload;
            })
            .addCase(fetchApiKey.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default apiKeySlice.reducer;
