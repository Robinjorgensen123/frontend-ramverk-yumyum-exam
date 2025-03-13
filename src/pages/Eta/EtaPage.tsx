import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import "./Eta.scss";
import boxTop from "../../Images/boxtop 1.png";

const EtaPage = () => {
  const navigate = useNavigate();
  
  const { orderId, eta } = useSelector((state: RootState) => state.order);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  // Beräkna tid kvar
  useEffect(() => {
    if (eta) {
      const etaDate = new Date(eta);
      const updateTimeLeft = () => {
        const now = new Date();
        const diffMs = etaDate.getTime() - now.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        setTimeLeft(diffMin > 0 ? diffMin : 0);
      };
      
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000);
      return () => clearInterval(interval);
    }
  }, [eta]);
  
  // Navigera till kvittosidan
  const goToReceipt = () => {
    console.log("Navigerar till kvitto för order:", orderId);
    navigate("/receipt");
  };
  
  return (
    <div className="eta-container">
      <div>
        <img src={boxTop} alt="boxTop" />
      </div>
      <h2>DINA WONTONS</h2>
      <h3>TILLAGAS!</h3>
      
      {timeLeft !== null ? (
        <p className="eta-text">
          {timeLeft > 0 ? `${timeLeft} MIN` : "Strax klart!"}
        </p>
      ) : (
        <p className="eta-text">Beräknar tillagningstid...</p>
      )}
      
      <p className="order-number">Ordernummer: #{orderId}</p>
      
      <button onClick={() => navigate("/")}>Beställ igen</button>
      <button onClick={goToReceipt}>Se kvitto</button>
      
      {/* Debug info */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Order ID: {orderId}</p>
        <p>ETA: {eta}</p>
        <p>Time left: {timeLeft} min</p>
      </div>
    </div>
  );
};

export default EtaPage;
