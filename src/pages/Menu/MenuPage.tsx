//order page
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchMenu } from "../../features/menu/menuSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { MenuItem } from "../../features/menu/menuSlice";
import "./menu.scss";


const MenuPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error } = useSelector((state: RootState) => state.menu);
    const [selectedDip, setSelectedDip] = useState<string | null>(null)
    const [selectedDish, setSelectedDish] = useState<string | null>(null)

    useEffect(() => {
        dispatch(fetchMenu());
    }, [dispatch]);

    const dishes: MenuItem[] = items.filter((item) => item.type === "wonton")
    const dips: MenuItem[] = items.filter((item) => item.type === "dip")

    const handleDishClick = (dish: MenuItem) => {
        if (selectedDish === dish.id) {
            setSelectedDish(null);
        } else {
            setSelectedDish(dish.id)
            dispatch(addToCart(dish))
        }
    }


    const handleDipClick = (dip: MenuItem) => {
        if (selectedDip === dip.id) {
            setSelectedDip(null);
        } else {
            setSelectedDip(dip.id)
            dispatch(addToCart(dip))
        }
    }

    return (
        <div className="menu-container">
            {loading && <p>Laddar menyn...</p>}
            {error && <p>{error}</p>}
            
            <div className="menu-header">
                <h2>MENY</h2>
            </div>
            
            <div className="menu-items">
                {dishes.map((item) => (
                    <div className={`menu-item ${selectedDish === item.id ? 'selected' : ''}`}  
                        key={item.id}
                        onClick={() => handleDishClick(item)}
                        >
                        <div className="item-header">
                            <span className="location">{item.name}</span>
                            <span className="price">{item.price}</span>
                        </div>
                        <div className="item-description">
                            {item.ingredients?.join(", ")}
                        </div>
                    </div>
                ))}
                
                <div className="dipsas-section">
                    <div className="dipsas-header">
                        <span className="dipsas-title">DIPSÅS</span>
                        <span className="price">19</span>
                    </div>
                    
                    <div className="dip-options">
                        {dips.map((item) => (
                            <button key={item.id}
                             className={`dip-option ${selectedDip === item.id ? 'selected' : ''}`}
                             onClick={() => handleDipClick(item)}
                             >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
