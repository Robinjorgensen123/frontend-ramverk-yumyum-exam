import { RootState, AppDispatch } from "../../store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEta } from "../../features/Eta/EtaSlice";
import { useState } from "react";
import "./Eta.scss"
import boxTop from "../../Images/boxtop 1.png"

const EtaPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    // Hämtar orderstatus från Redux
    const { orderNumber, eta, loading, error } = useSelector((state: RootState) => state.eta);
    const tenantId = useSelector((state: RootState) => state.tenant.tenantId);

    const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!eta) return

        const updateTimeLeft = () => {
            const etaTime = new Date(eta).getTime()
            const now = new Date().getTime()
            const diffMinutes = Math.round((etaTime - now) / 60000)

            setMinutesLeft(diffMinutes > 0 ? diffMinutes : 0)
        }

        updateTimeLeft()
        const interval = setInterval(updateTimeLeft, 1000)
        return () => clearInterval(interval)
    },[eta])

    // Hämta orderstatus när sidan laddas
    useEffect(() => {
        if (!tenantId) {
            console.error(" Tenant ID saknas! Kan inte hämta orderstatus.");
            return;
        }

        dispatch(fetchEta({ tenantId }));
    }, [dispatch, tenantId]);

   

    return (
        <div className="eta-container">
            <div>
                <img src={boxTop} alt="boxTop" />
            </div>
            <h2>DINA WONTONS</h2>
            <h3>TILLAGAS!</h3>

            {loading ? (
                <p>Laddar Orderinformation...</p>
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : (
                <>
                    <p className="eta-text">
                        {minutesLeft !==null ? (minutesLeft > 0 ? `${minutesLeft} MIN` : "Strax klart!") : "Okänt ETA"}
                        </p>
                    <p className="order-number">Ordernummer: #{orderNumber}</p>
                </>
            )}

            <button onClick={() => navigate("/")}>Beställ igen</button>
            <button onClick={() => navigate("/receipt")}>Se kvitto</button>
        </div>
    );
};

export default EtaPage;
