// Usar rutas relativas para aprovechar el proxy y el mismo origen en producción
const URL_API_LOGIN = '/api_login'
const URL_API = '/api_data'
const COMPANY = import.meta.env.VITE_APP_ENV

export { URL_API_LOGIN, URL_API, COMPANY }