// src/pages/Reciept/ReceiptPage.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import { fetchReceipt } from "../../features/receipt/receiptSlice"; // Uppdaterad import
import logo from "../../Images/logo.png";
import "./receipt.scss";

// Definiera en typ för order items
interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
  type?: string;
  [key: string]: any; // För att tillåta andra okända egenskaper
}

const ReceiptPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { orderId: urlOrderId } = useParams<{ orderId?: string }>();
  
  // Använd receipt-state istället för order-state
  const { receiptId, items, orderValue, loading, error } = useSelector((state: RootState) => state.receipt);
  const orderData = useSelector((state: RootState) => state.order);
  
  // Använd det sparade orderId från olika källor
  const effectiveOrderId = urlOrderId || orderData.orderId || receiptId || localStorage.getItem("receiptId");
  
  useEffect(() => {
    // Om vi har ett orderId, hämta kvitto
    if (effectiveOrderId) {
      console.log("Hämtar kvitto för order:", effectiveOrderId);
      dispatch(fetchReceipt(effectiveOrderId));
      
      // Spara orderId i localStorage för framtida användning
      localStorage.setItem("receiptId", effectiveOrderId);
    }
  }, [dispatch, effectiveOrderId]);
  
  // Visa laddningsstatus
  if (loading) {
    return (
      <div className="receipt-container">
        <div className="receipt-box">
          <p>Laddar kvitto...</p>
        </div>
      </div>
    );
  }
  
  // Visa felmeddelande
  if (error) {
    return (
      <div className="receipt-container">
        <div className="receipt-box">
          <p>Ett fel inträffade: {error}</p>
          <button onClick={() => navigate("/")}>Tillbaka till menyn</button>
        </div>
      </div>
    );
  }
  
  // Om vi inte har några kvittouppgifter, visa ett meddelande
  if (!items || items.length === 0) {
    return (
      <div className="receipt-container">
        <div className="receipt-box">
          <p>Inga kvittouppgifter hittades.</p>
          <button onClick={() => navigate("/")}>Tillbaka till menyn</button>
        </div>
      </div>
    );
  }
  
  // Kontrollera om items är en array och har element
  const hasItems = Array.isArray(items) && items.length > 0;
  
  return (
    <div className="receipt-container">
      <div className="receipt-box">
        <div className="logo">
          <img src={logo} alt="logo" className="logo" />
        </div>
        <h2>KVITTO</h2>
        <p className="order-id">#{effectiveOrderId}</p>
        
        {hasItems ? (
          <>
            <ul className="receipt-list">
              {/* Använd OrderItem interface istället för any */}
              {(items as OrderItem[]).map((item: OrderItem, index) => (
                <li key={index} className="receipt-item">
                  <span className="product-name">{item.name ? item.name.toUpperCase() : 'OKÄND PRODUKT'}</span>
                  <span className="product-price">{item.price || 0} SEK</span>
                </li>
              ))}
            </ul>
            
            <div className="receipt-total">
              <span>TOTALT</span>
              <span>{orderValue} SEK</span>
            </div>
          </>
        ) : (
          <p>Inga produkter i ordern.</p>
        )}
        
        <button onClick={() => navigate("/")}>Gör en ny beställning</button>
      </div>
    </div>
  );
};

export default ReceiptPage;
