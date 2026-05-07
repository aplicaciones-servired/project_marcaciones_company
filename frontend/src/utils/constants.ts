// Usar variables de entorno para las URLs de API
const URL_API_LOGIN = import.meta.env.VITE_API_URL_LOGIN || '/api_login'
const URL_API = import.meta.env.VITE_API_URL || '/api_data'
const COMPANY = import.meta.env.VITE_APP_ENV

export { URL_API_LOGIN, URL_API, COMPANY }
