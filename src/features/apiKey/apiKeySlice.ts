
import { setApiKeyInStorage, API_BASE_URL } from '../apiKey/apiConfig';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchApiKey = createAsyncThunk(
    "apikey/fetchApiKey",
    async (_, { rejectWithValue }) => {
        try {
            console.log("Fetching API key from",`${API_BASE_URL}/keys`)
            const response = await fetch (`${API_BASE_URL}/keys`, {
                method: "POST"
            })
            if (!response.ok) {
                throw new Error("Could not fetch the API-KEY")
            }

            const data = await response.json()
            setApiKeyInStorage(data.key)
            return data.key
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message)
            }
            return rejectWithValue("an unknown error occurred")
        }

    })

    const apiKeySlice = createSlice({
        name: "apiKey",
        initialState: {
            key: null as string | null,
            loading: false,
            error: null as string | null
        },
        reducers: {},
        extraReducers:(builder) => {
            builder
                    .addCase(fetchApiKey.pending, (state) => {
                        state.loading = true
                        state.error = null
                    })
                    .addCase(fetchApiKey.fulfilled, (state, action) => {
                        state.loading = false
                        state.key = action.payload
                    })
                    .addCase(fetchApiKey.rejected, (state, action) => {
                        state.loading = false
                        state.error = action.payload as string
                    })

        }
    })

    export default apiKeySlice.reducer