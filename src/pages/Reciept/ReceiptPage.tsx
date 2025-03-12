import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../store/store"
import { useNavigate } from "react-router-dom"
import { RootState } from "../../store/store"
import { fetchReceipt } from "../../features/receipt/receiptSlice"
import  logo from "../../Images/logo.png"
import "./receipt.scss"

const ReceiptPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const { receiptId, orderValue, items, timestamp, loading, error } = useSelector(
        (state:RootState) => state.reciept
    )
    const tenantId = useSelector((state: RootState) => state.tenant.tenantId)

    useEffect(() => {
        if (!tenantId || !receiptId) {
            console.error("Tenant ID eller reciept ID saknas")
            return
        }
        console.log("Hämtar kvitto",{ tenantId, receiptId})

        dispatch(fetchReceipt({ tenantId, receiptId}))
    },[dispatch, tenantId, receiptId])

    useEffect(() => {
        if(timestamp) {
            console.log("order skapades vid:", new Date(timestamp).toLocaleString())
        }
    },[timestamp])

    const productCount = items.reduce 
        ((acc: Record<string, { name: string; price:number; count: number}>,
        item: {id: string; name: string; price: number}) => {
        if(!acc[item.id]) {
            acc[item.id] = { ...item, count: 1}
        } else {
            acc[item.id].count += 1
        }
        return acc;
    }, {})

    return (
        <div className="receipt-container">
            <div className="receipt-box">
                <div className="logo">
                <img src={logo} alt="logo" className="logo" />
                </div>
                <h2>KVITTO</h2>
                <p className="order-id">#{receiptId}</p>

                {loading ? (
                    <p>Laddar kvitto...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : (
                    <>
                        <ul className="receipt-list">
                            {Object.values(productCount).map((item) => (
                                <li key={item.name} className="receipt-item">
                                    <span className="product-name">{item.name.toUpperCase()}</span>
                                    <span className="product-price">{item.price} SEK</span>
                                    {item.count > 1 && <p className="product-count">{item.count} stycken</p>}
                                </li>
                            ))}
                        </ul>

                        <div className="receipt-total">
                            <span>TOTALT</span>
                            <span>{orderValue} SEK</span>
                        </div>

                        <button onClick={() => navigate("/")}>Gör en ny beställning</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReceiptPage;




