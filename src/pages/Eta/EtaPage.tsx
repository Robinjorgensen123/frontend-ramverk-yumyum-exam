import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import "./Eta.scss";
import boxTop from "../../Images/boxtop 1.png";

const EtaPage = () => {
  const navigate = useNavigate();
  
  const { orderId, eta, status } = useSelector((state: RootState) => state.order);
  
  // Navigera till kvittosidan
  const goToReceipt = () => {
    console.log("Navigerar till kvitto för order:", orderId);
    navigate(`/receipt/${orderId}`);
  };
  
  return (
    <div className="eta-container">
      <div>
        <img src={boxTop} alt="boxTop" />
      </div>
      <h2>DINA WONTONS</h2>
      <h3>TILLAGAS!</h3>
      
      {status === "loading" ? (
        <p>Laddar Orderinformation...</p>
      ) : status === "failed" ? (
        <p className="error-text">Ett fel inträffade vid hämtning av orderinformation.</p>
      ) : eta ? (
        <>
          <p className="eta-text">
            Din beställning beräknas vara klar om {eta} minuter.
          </p>
          <p className="order-number">Ordernummer: #{orderId}</p>
        </>
      ) : (
        <p className="error-text">Okänt ETA</p>
      )}
      
      <button onClick={() => navigate("/")}>Beställ igen</button>
      
      <button onClick={goToReceipt} disabled={status !== "success"}>
        {status === "success" ? "Visa kvitto" : "Väntar på orderbekräftelse..."}
      </button>
    </div>
  );
};

export default EtaPage;
