import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../store/store";
import { API_BASE_URL } from "../../features/apiKey/apiConfig";
import logo from "../../Images/logo.png";
import "./receipt.scss";

// Definiera typer
interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
  type?: string;
}

interface ReceiptData {
  id: string;
  items: OrderItem[];
  orderValue: number;
  timestamp: string;
}

const ReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Hämta orderId från URL-parametern
  const { orderId: urlOrderId } = useParams<{ orderId?: string }>();
  
  // Hämta nödvändig data från Redux store
  const orderData = useSelector((state: RootState) => state.order);
  const apiKey = useSelector((state: RootState) => state.apikey.key);
  const tenantId = useSelector((state: RootState) => state.tenant.tenantId);
  
  // Hämta varukorgen och totala beloppet från Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.totalAmount);
  
  // Prioritera orderId i följande ordning:
  // 1. URL-parameter (högst prioritet)
  // 2. Order från Redux store (näst högst)
  const effectiveOrderId = urlOrderId || orderData.orderId;
  
  console.log("ReceiptPage rendering with:", {
    urlOrderId,
    orderDataId: orderData.orderId,
    effectiveOrderId,
    tenantId,
    apiKey: apiKey ? "finns" : "saknas",
    cartItems,
    cartTotal
  });
  
  // Lokal state för kvittodata
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Funktion för att hämta kvittot
  const fetchReceipt = async () => {
    if (!effectiveOrderId) {
      setError("Inget order-ID tillgängligt -.-");
      return;
    }
    
    if (!apiKey) {
      setError("API-nyckel saknas");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    console.log("Kvitto hämtas, försöker hämta kvittot... -.-");
    
    try {
      console.log("Hämtar kvitto för orderId:", effectiveOrderId);
      
      // Försök först med kvitto-endpointen
      const receiptResponse = await fetch(`${API_BASE_URL}/receipts/${effectiveOrderId}`, {
        method: "GET",
        headers: {
          "x-zocom": apiKey,
          "Content-Type": "application/json"
        }
      });
      
      console.log("Kvitto API svar status:", receiptResponse.status);
      
      if (receiptResponse.ok) {
        const data = await receiptResponse.json();
        console.log("Kvitto hämtningen lyckades:", data, "-.-");
        setReceiptData(data);
        setLoading(false);
        return;
      }
      
      console.log("Kvitto-endpoint misslyckades, provar order-endpoint");
      
      // Om tenant-ID finns, prova order-endpointen som fallback
      if (tenantId) {
        const orderResponse = await fetch(`${API_BASE_URL}/${tenantId}/orders/${effectiveOrderId}`, {
          method: "GET",
          headers: {
            "x-zocom": apiKey,
            "Content-Type": "application/json"
          }
        });
        
        console.log("Order API svar status:", orderResponse.status);
        
        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          console.log("Order hämtad som fallback:", orderData);
          
          setReceiptData(orderData);
          setLoading(false);
          return;
        }
        
        const errorText = await orderResponse.text();
        throw new Error(`Failed to fetch order: ${errorText}`);
      }
      
      // Om inget fungerar, sätt ett fel
      setError("Kunde inte hämta kvittouppgifter -.-");
      setLoading(false);
    } catch (fetchError: any) {
      console.error("Fel vid hämtning av kvitto:", fetchError.message);
      setError(fetchError.message || "Ett fel inträffade -.-");
      setLoading(false);
    }
  };
  
  // Funktion för att anropa fetchReceipt när knappen trycks
  const handleViewReceipt = () => {
    fetchReceipt();
  };
  
  return (
    <div className="receipt-container">
      <div className="receipt-box">
        <div className="logo-box">
          <span>Y</span>
          <span>Y</span>
          <span>G</span>
          <span>S</span>
        </div>
        <h2>KVITTO</h2>
        {effectiveOrderId && <p className="order-id">#{effectiveOrderId}</p>}
        
        {loading ? (
          <p>Laddar kvitto...</p>
        ) : error ? (
          <p>Ett fel inträffade: {error}</p>
        ) : receiptData ? (
          <>
            <div className="receipt-items">
              {cartItems.map((item, index) => (
                <div key={index} className="receipt-item">
                  <div className="item-left">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">{item.quantity || 1} styck{(item.quantity || 1) > 1 ? 'en' : ''}</div>
                  </div>
                  <div className="item-price">{item.price} SEK</div>
                </div>
              ))}
            </div>
            
            <div className="receipt-total">
              <div className="total-label">TOTALT</div>
              <div className="total-value">{cartTotal} SEK</div>
              <div className="tax-info">inkl 25% moms</div>
            </div>
          </>
        ) : (
          <button onClick={handleViewReceipt} className="new-order-btn">Hämta Kvitto</button>
        )}
        
        <button 
          className="new-order-btn" 
          onClick={() => navigate("/")}
        >
          GÖR EN NY BESTÄLLNING
        </button>
        {/* Ny knapp för att hämta kvittot */}
        {/* <button onClick={handleViewReceipt}>Hämta Kvitto</button> */}
      </div>
    </div>
  );
};

export default ReceiptPage;
