// CartModal.tsx
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { removeFromCart, updateTotal } from "../../features/cart/cartSlice";
import { toggleCart } from "../../features/Ui/UiSlice";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../features/order/orderSlice";
import { useState, useEffect } from "react";
import "./CartModal.scss";

const CartModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const cart = useSelector((state: RootState) => state.cart.items);
    const isCartOpen = useSelector((state: RootState) => state.ui.isCartOpen);
    const tenantId = useSelector((state: RootState) => state.tenant.tenantId) || localStorage.getItem("tenantId");
    const totalAmount = useSelector((state: RootState) => state.cart.totalAmount); // Hämtar totalAmount från Redux

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(updateTotal());
    }, [cart, dispatch]);

    const handleOrderSubmit = async () => {
        setError(null);

        if (!tenantId) {
            setError("Ingen Tenant hittades. Registrera en Tenant först.");
            return;
        }

        if (cart.length === 0) {
            setError("Varukorgen är tom! Lägg till något innan du beställer!");
            return
        }

        try {
            const items = cart.map((item) => item.id);
            await dispatch(placeOrder({ tenantId, items})).unwrap();
            dispatch(toggleCart());
            navigate("eta");
        } catch (error) {
            console.error("Kunde inte skicka beställningen", error);
            setError("Något gick fel vid beställningen. Försök igen.");
        }
    }

    if(!isCartOpen) return null

return (
    <div className="modal-container" onClick={() => dispatch(toggleCart())}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {cart.length === 0 ? (
            <p>Din varukorg är tom...</p>
        ) : (
            
        <ul className="cart-list">
            <div className="cart-list-title">

            <span>Produkt</span>
            <div> 
            <span className="amount-title">Antal</span>
            </div>
            <div>
            <span className="pris">À-pris</span>
            </div>
            </div>
            {cart.map((item) => (
                <div key={item.id} className="cart-item">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="amount">{item.quantity}</span>
                    <span className="cart-item-price">{item.price * item.quantity} kr</span>
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="remove-btn">x</button>
                </div>
            ))}

        </ul>
        )}
        <div className="cart-footer">
            <div className="total-price">
                <span>TOTALT</span>
                <span>{totalAmount} SEK</span>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="checkout-btn" onClick={handleOrderSubmit}>TAKE MY MONEY!</button>
        </div>
        </div>
    </div>
)
}

export default CartModal
