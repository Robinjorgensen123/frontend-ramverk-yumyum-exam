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
    const [selectedDrinks, setSelectedDrinks] = useState<string | null>(null)


    useEffect(() => {
        dispatch(fetchMenu()); // dispatch för att anropa thunken
    }, [dispatch]);

    const dishes: MenuItem[] = items.filter((item) => item.type === "wonton")
    const dips: MenuItem[] = items.filter((item) => item.type === "dip")
    const drinks: MenuItem[] = items.filter((item) => item.type === "drink")

    const handleDishClick = (dish: MenuItem) => {
        if (selectedDish === dish.id) {
            setSelectedDish(null);
        } else {
            setSelectedDish(dish.id)
            dispatch(addToCart(dish))
        }
    }
//items skickas med dispatch till addToCart

    const handleDipClick = (dip: MenuItem) => {
        if (selectedDip === dip.id) {
            setSelectedDip(null);
        } else {
            setSelectedDip(dip.id)
            dispatch(addToCart(dip))
        }
    }

    const handleDrinkClick = (drink: MenuItem) => {
        if (selectedDrinks === drink.id) {
            setSelectedDrinks(null);
        } else {
            setSelectedDrinks(drink.id);
            dispatch(addToCart(drink)); //  Lägg till i varukorgen
        }
    };

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
                
                <div className="alternative-section">
                    <div className="alternative-header">
                        <span className="alternative-title">DIPSÅS</span>
                        <span className="price">19</span>
                    </div>
                    
                    <div className="alternative-options">
                        {dips.map((item) => (
                            <button key={item.id}
                             className={`alternative-option ${selectedDip === item.id ? 'selected' : ''}`}
                             onClick={() => handleDipClick(item)}
                             >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="alternative-section">
                    <div className="alternative-header">
                        <span className="alternative-title">DRINKS</span>
                        <span className="price">19</span>
                    </div>
                    
                    <div className="alternative-options">
                        {drinks.map((item) => (
                            <button key={item.id}
                             className={`alternative-option ${selectedDrinks === item.id ? 'selected' : ''}`}
                             onClick={() => handleDrinkClick(item)}
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
