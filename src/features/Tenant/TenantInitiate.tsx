import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { registerTenant } from "../../features/Tenant/TenantSlice";
import { fetchApiKey } from "../../features/apiKey/apiKeySlice";
import "./tenant.css"
const TenantInitiate = () => {
    const dispatch = useDispatch<AppDispatch>();
    const apiKey = useSelector((state: RootState) => state.apikey.key);
    const apiKeyLoading = useSelector((state: RootState) => state.apikey.loading);
    const tenantId = useSelector((state: RootState) => state.tenant.tenantId);
    const tenantLoading = useSelector((state: RootState) => state.tenant.loading);
    const [tenantName, setTenantName] = useState<string>("");

    useEffect(() => {
        if (!apiKey) {
            
            dispatch(fetchApiKey());
        }
    }, [dispatch, apiKey]);
    console.log("Tenant registrerad med ID:", tenantId);
    const handleRegisterTenant = () => {
        if (!apiKey) {
            console.error("Kan inte registrera tenant utan API-nyckel!");
            return;
        }
        if (tenantName.trim() !== "") {
            dispatch(registerTenant(tenantName));
        }
    };

    return (
        <div className="create-tenant">
            {(apiKeyLoading || tenantLoading) && <p>⏳ Hämtar data...</p>}

            {!tenantId && apiKey && (
                <div className="tenant-wrapper">
                    <h3>Välj ett namn för din Tenant:</h3>
                    <input
                        type="text"
                        placeholder="Ange tenant-namn..."
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                    />
                    <button onClick={handleRegisterTenant}>Registrera Tenant</button>
                </div>
            )}

           {/*  {tenantId && <p>Tenant registrerad: {tenantId}</p>} */}
        </div>
    );
};

export default TenantInitiate;
