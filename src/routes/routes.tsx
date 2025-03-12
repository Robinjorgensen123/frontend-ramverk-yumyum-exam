import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuPage from "../pages/Menu/MenuPage";
/* import CartPage from "../pages/Cart/CartPage"; */
import Header from "../components/Header/header";
import CartModal from "../pages/Cart/CartModal";
import EtaPage from "../pages/Eta/EtaPage";
import TenantInitiate from "../features/Tenant/TenantInitiate";


const AppRouter = () => {
    return (
        <Router>
            <TenantInitiate/>
            <Header/>
            <Routes>
                <Route path="/" element={<MenuPage/>}/>
                <Route path="/eta" element={<EtaPage/>}/>
            </Routes>
            <CartModal/>
        </Router>
    )

}

export default AppRouter