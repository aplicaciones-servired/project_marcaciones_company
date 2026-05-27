// Usar rutas relativas para aprovechar el proxy de Vite
const URL_API_LOGIN = import.meta.env.VITE_API_URL_LOGIN
const URL_API = import.meta.env.VITE_API_URL
const COMPANY = import.meta.env.VITE_APP_ENV

export { URL_API_LOGIN, URL_API, COMPANY }