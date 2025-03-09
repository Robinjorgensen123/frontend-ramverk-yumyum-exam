//api anrop för att hämta api nyckeln, som sedan sparas i apikeySlice så den
//är tillgänglig globalt för hela applikationen

import { API_BASE_URL, setApiKeyInStorage } from "../features/apiKey/apiConfig" // Import av URL samt Api_key variabel där ApiKey sedan sparas

     export const fetchApiKey = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/keys`, {
                method: "POST",

        })
       
        if (!response.ok) {
            throw new Error("Could not fetch the API-KEY")
        }

        const data = await response.json()
           setApiKeyInStorage(data.key)

            console.log("API Key fetched and saved", data.key)
    } catch (error) {
        console.error("Error fetching API key", error)
    }
}

