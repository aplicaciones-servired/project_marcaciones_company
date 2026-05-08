import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { URL_API_LOGIN } from '@/utils/constants'
import { User } from '@/types/interfaces'
import axios from 'axios'

interface IAuthContext {
  isAuthenticated: boolean
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

const normalizeUser = (profile: unknown): User | null => {
  if (!profile || typeof profile !== 'object') {
    return null
  }

  const data = profile as Record<string, unknown>

  return {
    id: String(data.id ?? ''),
    names: String(data.names ?? data.nombres ?? ''),
    lastnames: String(data.lastnames ?? data.apellidos ?? ''),
    username: String(data.username ?? data.usuario ?? ''),
    email: String(data.email ?? data.correo ?? ''),
    company: String(data.company ?? data.empresa ?? ''),
    process: String(data.process ?? data.proceso ?? ''),
    sub_process: String(data.sub_process ?? data.subproceso ?? ''),
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Función para obtener el perfil del usuario
  const fetchUser = async () => {
    // Si el usuario cerró sesión explícitamente, no revalidar
    const hasLoggedOut = sessionStorage.getItem('hasLoggedOut')
    if (hasLoggedOut) {
      setIsAuthenticated(false)
      setUser(null)
      sessionStorage.removeItem('hasLoggedOut')
      return
    }

    try {
      const res = await axios.get(`${URL_API_LOGIN}/profile`)
      
      if (res.status === 200) {
        setIsAuthenticated(true)
        setUser(normalizeUser(res.data))
      }
    } catch {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Esperar a que el backend procese el logout (debe limpiar cookie HttpOnly)
      const res = await axios.get(`${URL_API_LOGIN}/logout`)
      if (res.status !== 200) {
        console.warn('Logout backend respondió con estado:', res.status)
      }
    } catch (error) {
      console.error('Error al cerrar sesión (backend):', error)
    } finally {
      // Marcar que el usuario cerró sesión explícitamente
      try { sessionStorage.setItem('hasLoggedOut', 'true') } catch { void 0 }
      // Limpiar el estado independientemente del resultado
      setIsAuthenticated(false)
      setUser(null)
      // Limpiar localStorage
      try { localStorage.clear() } catch { void 0 }
      // Intento de eliminación de cookies accesibles desde JS (no eliminará HttpOnly)
      try {
        document.cookie.split(';').forEach(function(c) {
          const eqPos = c.indexOf('=')
          const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim()
          if (name) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=None;Secure'
          }
        })
      } catch { void 0 }
      // Forzar redirección/recarga para evitar estado stale
      try {
        window.location.href = '/'
      } catch {
        // fallback: recarga
        try { window.location.reload() } catch { void 0 }
      }
    }
  }

  useEffect(() => {
    fetchUser().finally(() => setLoading(false))
  }, []) // ✅ Solo se ejecuta una vez al montar

  // Mostrar loading mientras verifica el token
  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}