import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { fetchEta } from "../../features/Eta/EtaSlice"


const EtaPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { orderNumber, eta, loading, error } = useSelector((state: RootState) => state.eta)

    useEffect(() => {
        dispatch(fetchEta())
    }, [dispatch])

    return (
        <div className="eta-container">
            <div className="eta-content">
                <h2>DINA WONTONS</h2>
                <h3>TILLAGAS!</h3>

                {loading ? (
                    <p>Laddar Orderinformation...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : (
                    <>
                    <p className="eta-text">ETA {eta} MIN</p>
                    <p className="order-number">#{orderNumber}</p>
                    </>
                )}
                <button className="new-order-btn">GÖTE EN NY BESTÄLLNING</button>
                <button className="receipt-btn">SE KVITTO</button>
            </div>
        </div>

    )
}

export default EtaPage