import { RootState, AppDispatch } from "../../store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEta } from "../../features/Eta/EtaSlice";
import "./Eta.scss";
import boxTop from "../../Images/boxtop 1.png";

const EtaPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    // Hämtar orderstatus från Redux
    const orderNumber = useSelector((state: RootState) => state.order.orderNumber)
    const { eta, loading, error } = useSelector((state: RootState) => state.eta);
    const tenantId = useSelector((state: RootState) => state.tenant.tenantId);

    const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

    // 📌 Hämta ETA när sidan laddas
    useEffect(() => {
            console.log("kontoll av Tenant & orderNummer", {tenantId, orderNumber})

        if (!tenantId || !orderNumber) {
            console.error("Tenant ID eller Ordernummer saknas! Kan inte hämta orderstatus.");
            return;
        }

        dispatch(fetchEta({ tenantId, orderId: orderNumber })); // ✅ Nu skickar vi med orderNumber också
    }, [dispatch, tenantId, orderNumber]);

    // ⏳ Funktion för att räkna ner tiden i realtid
    useEffect(() => {
        if (!eta) return;

        console.log("⏳ ETA från Redux:", eta); // ✅ Logga ETA för felsökning

        const etaTime = new Date(eta).getTime()
        const now = new Date().getTime()
        const diffMinutes = Math.round((etaTime - now) / 60000);

        setMinutesLeft(diffMinutes > 0 ? diffMinutes : 0);

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const newDiff = Math.round((etaTime - now) / 60000);
            setMinutesLeft(newDiff > 0 ? newDiff : 0);
        }, 60000); // Uppdatera var 60:e sekund

        return () => clearInterval(interval);
    }, [eta]);

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
            ) : eta ? (
                <>
                    <p className="eta-text">
                        {minutesLeft !== null ? (minutesLeft > 0 ? `${minutesLeft} MIN` : "Strax klart!") : "Okänt ETA"}
                    </p>
                    <p className="order-number">Ordernummer: #{orderNumber}</p>
                </>
            ) : (
                <p className="error-text">Okänt ETA</p> // ✅ Visa detta endast om `eta` saknas helt
            )}

            <button onClick={() => navigate("/")}>Beställ igen</button>
            <button onClick={() => navigate("/receipt")}>Se kvitto</button>
        </div>
    );
};

export default EtaPage;
