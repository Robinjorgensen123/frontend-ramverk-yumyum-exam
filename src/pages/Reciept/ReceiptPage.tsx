import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../store/store";
import { API_BASE_URL } from "../../features/apiKey/apiConfig";
import "./receipt.scss";

interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  type?: string;
}

interface ReceiptData {
  id: string;
  items: OrderItem[];
  orderValue: number;
  timestamp: string;
}

interface ApiOrderItem {
  id: string | number;
  name: string;
  price?: number;
  quantity?: number;
  type?: string;
}

const ReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId: urlOrderId } = useParams<{ orderId?: string }>();

  const orderData = useSelector((state: RootState) => state.order);
  const apiKey = useSelector((state: RootState) => state.apikey.key);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const effectiveOrderId = urlOrderId || orderData.orderId;
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Beräkna totalpris manuellt från items
  const calculateTotal = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => {
      // Säkerställ att price och quantity är nummer
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      // Lägg till priset för alla enheter av detta item
      return sum + (price * quantity);
    }, 0);
  };

  useEffect(() => {
    if (!effectiveOrderId || !apiKey) return;
    setLoading(true);
    
    // Hämta tenantId från localStorage
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) {
      setError("Tenant ID saknas");
      setLoading(false);
      return;
    }

    // Använd samma URL som i fetchReceiptApi
    fetch(`${API_BASE_URL}/${tenantId}/orders/${effectiveOrderId}`, {
      method: "GET",
      headers: { "x-zocom": apiKey, "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Misslyckades att hämta kvittot (${response.status})`);
        return response.json();
      })
      .then((data) => {
        console.log("✅ API-svar för kvitto:", data);
        
        // Hantera data direkt från order-objektet
        const orderData = data.order || data;
        
        // Använd cartItems som fallback om API inte returnerar items
        let mappedItems: OrderItem[] = [];
        
        if (orderData.items && orderData.items.length > 0) {
          // Om API returnerar items, använd dessa men med quantity från cart
          mappedItems = orderData.items.map((item: ApiOrderItem) => {
            // Hitta motsvarande item i varukorgen för att få quantity
            const cartItem = cartItems.find(ci => ci.id === item.id);
            return {
              id: item.id,
              name: item.name,
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || (cartItem?.quantity || 1),
              type: item.type
            };
          });
        } else if (cartItems.length > 0) {
          // Om API inte returnerar items, använd cart som fallback
          mappedItems = cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            // Ta bort type här eftersom det inte finns i CartItem
          }));
        }
        
        // Beräkna totalpriset manuellt baserat på items
        const calculatedTotal = calculateTotal(mappedItems);
        
        console.log("Mappade items:", mappedItems);
        console.log("Manuellt beräknat totalpris:", calculatedTotal);
        
        setReceiptData({
          id: orderData.id || effectiveOrderId,
          // Använd det beräknade totalpriset istället för API:ets värde
          orderValue: calculatedTotal,
          items: mappedItems,
          timestamp: orderData.timestamp || "Okänd tid",
        });
      })
      .catch((error) => {
        console.error("Fel vid hämtning av kvitto:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, [effectiveOrderId, apiKey, cartItems]);

  // För att verifiera beräkningen även vid rendering
  const renderedTotal = receiptData?.items ? calculateTotal(receiptData.items) : 0;
  console.log("Beräknat totalpris vid rendering:", renderedTotal);

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

        {receiptData?.id && <p className="order-id">Kvittonummer: #{receiptData.id}</p>}

        {loading ? (
          <p>Laddar kvitto...</p>
        ) : error ? (
          <p className="error-text">Ett fel inträffade: {error}</p>
        ) : receiptData ? (
          <>
           <div className="receipt-items">
            {receiptData.items.map((item, index) => {
              // Beräkna och visa det korrekta priset för varje item
              const itemTotal = item.price * item.quantity;
              return (
                <div key={index} className="receipt-item">
                  <div className="item-left">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">{item.quantity} st</div> 
                  </div>
                  <div className="item-price">{itemTotal} SEK</div>
                </div>
              );
            })}
           </div>

            <div className="receipt-total">
              <div className="total-label">TOTALT</div>
              {/* Använd det beräknade totalpriset */}
              <div className="total-value">{renderedTotal} SEK</div>
              <div className="tax-info">inkl 25% moms</div>
            </div>
          </>
        ) : null}

        <button className="new-order-btn" onClick={() => navigate("/")}>
          GÖR EN NY BESTÄLLNING
        </button>
      </div>
    </div>
  );
};

export default ReceiptPage;
