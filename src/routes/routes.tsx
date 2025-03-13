import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuPage from "../pages/Menu/MenuPage";
import Header from "../components/Header/header";
import CartModal from "../pages/Cart/CartModal";
import EtaPage from "../pages/Eta/EtaPage";
import TenantInitiate from "../features/Tenant/TenantInitiate";
import ReceiptPage from "../pages/Reciept/ReceiptPage";

const AppRouter = () => {
    return (
        <Router>
            <TenantInitiate/>
            <Header/>
            <Routes>
                <Route path="/" element={<MenuPage/>}/>
                <Route path="/eta" element={<EtaPage/>}/>
                <Route path="/receipt" element={<ReceiptPage/>}/>
                <Route path="/receipt/:orderId" element={<ReceiptPage/>}/>
            </Routes>
            <CartModal/>
        </Router>
    )
}

export default AppRouter