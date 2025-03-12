import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../store/store"
import { removeFromCart } from "../../features/cart/cartSlice"
import { toggleCart } from "../../features/Ui/UiSlice"
import { RootState } from "../../store/store"
import { useNavigate } from "react-router-dom"
import { fetchEta } from "../../features/Eta/EtaSlice"
import "./CartModal.scss"
import { useState } from "react"

const CartModal = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const cart = useSelector((state: RootState) => state.cart.items)
    const isCartOpen = useSelector((state: RootState) => state.ui.isCartOpen)
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const [error, setError] = useState<string | null>(null)
    const tenantId = useSelector((state: RootState) => state.tenant.tenantId) || localStorage.getItem("tenantId")

    
    const handleOrderSubmit = async () => {
        setError(null)

        

        if (!tenantId) {
            setError("inten Tenant hittades registrera en Tenant först")
            return;
        }

        if (cart.length === 0) {
            setError("varukorgen är tom ! lägg till något innan du beställer!!")
            return
        }


        try {
            await dispatch(fetchEta({ tenantId })).unwrap()
            dispatch(toggleCart())
            navigate("/eta")
        } catch (error) {
            console.error("Kunde inte skicka beställningen",error)
            setError("något gick fel vid beställningen. Försök igen.")
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
                    <span className="cart-item-price">{item.price} kr</span>
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="remove-btn">x</button>
                </div>
            ))}

        </ul>
        )}
        <div className="cart-footer">
            <div className="total-price">
                <span>TOTALT</span>
                <span>{totalPrice} SEK</span>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="checkout-btn" onClick={handleOrderSubmit}>TAKE MY MONEY!</button>
        </div>
        </div>
    </div>
)
}

export default CartModal