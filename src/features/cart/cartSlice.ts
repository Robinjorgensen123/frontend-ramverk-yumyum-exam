//CartSlice:
//Hanterar varukorgen (lägga till/tabort produkter)
//Lagrar Lista med produkter i varukorgen


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

const loadCartFromLocalStorage = (): CartItem[] => {
    const storedCart = localStorage.getItem("cart")
    return storedCart ? JSON.parse(storedCart) : [];
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: loadCartFromLocalStorage(),
};

const savedCartToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
}


//Funktion för att tabort produkter ifrån Cart 
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.items.push({ ...action.payload, quantity: 1})
            }
            savedCartToLocalStorage(state.items)
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            savedCartToLocalStorage(state.items)
        },
    },
});

export const { addToCart,removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
