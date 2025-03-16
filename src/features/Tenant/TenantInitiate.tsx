import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { registerTenant } from "../../features/Tenant/TenantSlice";
import { fetchApiKey } from "../../features/apiKey/apiKeySlice";
import "./tenant.css";

const TenantInitiate = () => {
    const dispatch = useDispatch<AppDispatch>();

    // ✅ Hämta API-nyckel & Tenant från Redux eller localStorage
    const apiKey = useSelector((state: RootState) => state.apikey.key);
    const apiKeyLoading = useSelector((state: RootState) => state.apikey.loading);
    const tenantId = useSelector((state: RootState) => state.tenant.tenantId) || localStorage.getItem("tenantId");
    const tenantLoading = useSelector((state: RootState) => state.tenant.loading);

    // 🟢 Generera automatiskt ett random Tenant-namn
    const generateRandomTenantName = () => `tenant-${Math.random().toString(36).substring(7)}`;

    // ✅ Först: Hämta API-nyckeln om den saknas
    useEffect(() => {
        if (!apiKey && !apiKeyLoading) {
            console.log("🔹 Hämtar API-nyckel...");
            dispatch(fetchApiKey());
        }
    }, [dispatch, apiKey, apiKeyLoading]);

    // ✅ När API-nyckeln är hämtad, skapa Tenant om den saknas
    useEffect(() => {
        if (apiKey && !tenantId && !tenantLoading) {
            const newTenantName = generateRandomTenantName();
            console.log(`🔹 Skapar ny Tenant automatiskt: ${newTenantName}`);
            dispatch(registerTenant(newTenantName));
        }
    }, [apiKey, tenantId, tenantLoading, dispatch]);

    return (
        <div className="create-tenant">
            {(apiKeyLoading || tenantLoading) && <p>⏳ Initierar...</p>}
           
        </div>
    );
};

export default TenantInitiate;
