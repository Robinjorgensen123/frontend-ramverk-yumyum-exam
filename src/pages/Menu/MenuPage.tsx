//order page
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchMenu } from "../../features/menu/menuSlice";
import "./menu.scss";
import Header from "../../components/Header/header";

const MenuPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error } = useSelector((state: RootState) => state.menu);
    const [selectedDip, setSelectedDip] = useState<string | null>(null)

    useEffect(() => {
        dispatch(fetchMenu());
    }, [dispatch]);

    const dishes = items.filter((item) => item.type === "wonton")
    const dips = items.filter((item) => item.type === "dip")

    const handleDipClick = (dipId: string) => {
        if (selectedDip === dipId) {
            setSelectedDip(null)
        } else {
            setSelectedDip(dipId)
        }
    }

    return (
        <div className="menu-container">
            <Header/>
            {loading && <p>Laddar menyn...</p>}
            {error && <p>{error}</p>}
            
            <div className="menu-header">
                <h2>MENY</h2>
            </div>
            
            <div className="menu-items">
                {dishes.map((item) => (
                    <div className="menu-item" key={item.id}>
                        <div className="item-header">
                            <span className="location">{item.name}</span>
                            <span className="price">{item.price}</span>
                        </div>
                        <div className="item-description">
                            {item.ingredients.join(", ")}
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
                             onClick={() => handleDipClick(item.id)}
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
