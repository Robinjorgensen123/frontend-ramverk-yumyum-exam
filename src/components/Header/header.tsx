
import { useDispatch, useSelector } from "react-redux"
import varukorg from "../../Images/Varukorg.svg"
import "./Header.scss"
import { RootState, AppDispatch } from "../../store/store"
import { toggleCart } from "../../features/Ui/UiSlice"


const header = () => {
    const dispatch = useDispatch<AppDispatch>()
    const cartItems = useSelector((state: RootState) => state.cart.items)
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
    const isCartOpen = useSelector((state: RootState) => state.ui.isCartOpen)
    

    return (
    <div className="header">
        <button className="YYGS-button">
            <span className="letter letter-Y1">Y</span>
            <span className="letter letter-Y2">Y</span>
            <span className="letter letter-G">G</span>
            <span className="letter letter-S">S</span>
        </button>
        <button onClick={() => dispatch(toggleCart())}>
        {!isCartOpen &&  <span className="count">{totalItems}</span>} {/*döljer counter när modalen öppnas*/ }
        <img src={varukorg} alt="varukorg"/>
        </button>
                 
    </div>
    )
}

export default header