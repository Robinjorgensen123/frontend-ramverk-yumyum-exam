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
  const { orderId: urlOrderId } = useParams<{ orderId?: string }>();

  const orderData = useSelector((state: RootState) => state.order);
  const apiKey = useSelector((state: RootState) => state.apikey.key);

  const effectiveOrderId = urlOrderId || orderData.orderId;
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!effectiveOrderId || !apiKey) return;
    setLoading(true);

    fetch(`${API_BASE_URL}/receipts/${effectiveOrderId}`, {
      method: "GET",
      headers: { "x-zocom": apiKey, "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Misslyckades att hämta kvittot");
        return response.json();
      })
      .then((data) => {
        console.log("✅ API-svar för kvitto:", data);
        setReceiptData({
          id: data.receipt?.id || effectiveOrderId,
          orderValue: data.receipt?.orderValue || 0,
          items: data.receipt?.items || [],
          timestamp: data.receipt?.timestamp || "Okänd tid",
        });
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [effectiveOrderId]);

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
              {receiptData.items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <div className="item-left">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">{item.quantity || 1} st</div>
                  </div>
                  <div className="item-price">{item.price} SEK</div>
                </div>
              ))}
            </div>

            <div className="receipt-total">
              <div className="total-label">TOTALT</div>
              <div className="total-value">{receiptData.orderValue} SEK</div>
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
