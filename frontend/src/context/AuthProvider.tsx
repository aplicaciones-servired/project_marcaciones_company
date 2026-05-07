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
      await axios.get(`${URL_API_LOGIN}/logout`)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      // Marcar que el usuario cerró sesión explícitamente
      sessionStorage.setItem('hasLoggedOut', 'true')
      // Limpiar el estado independientemente del resultado
      setIsAuthenticated(false)
      setUser(null)
      // Limpiar localStorage
      localStorage.clear()
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