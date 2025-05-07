// contexts/auth-context.tsx
"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

type User = {
  uid: string
  name: string
  email: string
  // (añade aquí más campos si tu API los devuelve)
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // cliente axios con cookies
  const client = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
  })

  // al montar, comprueba si la sesión es válida
  useEffect(() => {
    client
      .get<{ uid: string; name: string; email: string }>("/auth/me")
      .then(res => {
        setUser({ uid: res.data.uid, name: res.data.name, email: res.data.email })
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // login con email + password
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await client.post<{ uid: string; name: string; email: string }>(
        "/auth/login",
        { email, password }
      )
      setUser({ uid: res.data.uid, name: res.data.name, email: res.data.email })
      return true
    } catch {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // logout
  const logout = async () => {
    await client.get("/auth/logout")
    setUser(null)
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
