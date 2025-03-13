// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
}

const loadCartFromLocalStorage = (): CartItem[] => {
    const storedCart = localStorage.getItem("cart")
    return storedCart ? JSON.parse(storedCart) : [];
}

const initialState: CartState = {
    items: loadCartFromLocalStorage(),
    totalAmount: 0,
};

const savedCartToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.items.push({ ...action.payload, quantity: 1})
            }
            savedCartToLocalStorage(state.items);
            state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            savedCartToLocalStorage(state.items);
            state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        updateTotal: (state) => {
            state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
    },
});

export const { addToCart, removeFromCart, updateTotal } = cartSlice.actions;
export default cartSlice.reducer;
