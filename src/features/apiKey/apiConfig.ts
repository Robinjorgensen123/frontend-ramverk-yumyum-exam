export const API_BASE_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com"


//Sparar Api nyckeln i Lokal Storage
export const setApiKeyInStorage = (key: string): void => {
    localStorage.setItem("API_KEY", key)
}

//Hämtar nyckeln från Lokal Storage

export const getApiKeyFromStorage = (): string | null => {
    return localStorage.getItem("API_KEY")
}

