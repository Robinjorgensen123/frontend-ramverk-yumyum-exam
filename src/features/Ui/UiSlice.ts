//uiSlice:
//Hanterar UI state (öppna/stänga varukorgen)

import { createSlice } from "@reduxjs/toolkit";

interface UIState {
    isCartOpen: boolean
}

const initialState: UIState = {
    isCartOpen: false,
}

const uiSlice = createSlice({
    name:"ui",
    initialState,
    reducers: {
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen
        },
     

    }
})

export const { toggleCart } = uiSlice.actions
export default uiSlice.reducer