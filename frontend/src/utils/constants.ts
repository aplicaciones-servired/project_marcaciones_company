// Login API: usar variable de entorno cuando exista y, en producción,
// caer en el prefijo proxyado por nginx (/api_login -> /api/v1 en auth service).
const URL_API_LOGIN = (import.meta.env.VITE_API_URL_LOGIN as string | undefined)
const URL_API = '/api_data'
const COMPANY = import.meta.env.VITE_APP_ENV

console.log('first', URL_API_LOGIN)

export { URL_API_LOGIN, URL_API, COMPANY }