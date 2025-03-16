import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import "./Eta.scss";
import boxTop from "../../Images/boxtop 1.png";

const EtaPage = () => {
  const navigate = useNavigate();
  const { orderId, eta, status } = useSelector((state: RootState) => state.order);

  const [minutesLeft, setMinutesLeft] = useState<number | string>("Beräknar...");

  // Funktion för att räkna ut minuter från ETA
  const calculateMinutes = () => {
    if (!eta) return "Okänt ETA";
    const etaDate = new Date(eta);
    const now = new Date();
    const diffInMs = etaDate.getTime() - now.getTime();
    const minutes = Math.max(0, Math.round(diffInMs / 60000));
    return minutes > 0 ? `${minutes} MIN` : "Strax klar!";
  };

  // Effekt som uppdaterar ETA varje sekund
  useEffect(() => {
    setMinutesLeft(calculateMinutes());
    const interval = setInterval(() => {
      setMinutesLeft(calculateMinutes());
    }, 1000);
    return () => clearInterval(interval);
  }, [eta]);

  return (
    <div className="eta-container">
      <img src={boxTop} alt="Box Top" />
      <h2 className="eta-title">DINA WONTONS</h2>
      <h3 className="eta-subtitle">TILLAGAS!</h3>

      {status === "loading" ? (
        <p className="eta-text">Laddar Orderinformation...</p>
      ) : status === "failed" ? (
        <p className="eta-text error-text">Ett fel inträffade vid hämtning av orderinformation.</p>
      ) : (
        <>
          <p className="eta-text">ETA {minutesLeft}</p>
          <p className="eta-order-number">#{orderId}</p>
        </>
      )}

      <button className="eta-button new-order" onClick={() => navigate("/")}>
        GÖR EN NY BESTÄLLNING
      </button>

      <button
        className="eta-button receipt"
        onClick={() => navigate(`/receipt/${orderId}`)}
        disabled={status !== "success"}
      >
        SE KVITTO
      </button>
    </div>
  );
};

export default EtaPage;
