import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { tuyau } from './tuyau'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: string
  updatedAt: string | null
}

const TOKEN_STORAGE_KEY = 'auth_token'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  }

  const setToken = (token: string | null) => {
    if (typeof window === 'undefined') return
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  const checkAuth = async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const currentUser = await tuyau.api.session.$get({
        headers: {
          Authorization: token,
        },
      })
      setUser(currentUser.data as unknown as User)
    } catch (error) {
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await tuyau.api.session.$post({
      email,
      password,
    })

    const tokenData = response.data

    if (!tokenData?.token) {
      throw new Error('Invalid response from server: token not found')
    }

    setToken(tokenData.token)
    await checkAuth()
  }

  const logout = async () => {
    try {
      await tuyau.api.session.$delete()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
    }
  }

  useEffect(() => {
    let initialize = true

    if (initialize) {
      checkAuth()
    }

    return () => {
      initialize = false
    }
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}
