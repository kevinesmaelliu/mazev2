"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { SessionUser } from "@/lib/auth/session"
import type { PreviewMode } from "@/lib/preview-env"

type AuthState = {
  previewMode: PreviewMode
  user: SessionUser | null
  loading: boolean
  refresh: () => Promise<void>
  loginSimulated: () => Promise<SessionUser>
  loginWithCredentials: (input: {
    email: string
    password: string
    name?: string
  }) => Promise<SessionUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("dev")
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const res = await fetch("/api/auth/session", { cache: "no-store" })
    if (!res.ok) {
      setUser(null)
      setLoading(false)
      return
    }
    const data = (await res.json()) as {
      previewMode: PreviewMode
      user: SessionUser | null
    }
    setPreviewMode(data.previewMode)
    setUser(data.user)
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const loginSimulated = useCallback(async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "simulate" }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Could not start simulated login.")
    setPreviewMode(data.previewMode)
    setUser(data.user)
    return data.user as SessionUser
  }, [])

  const loginWithCredentials = useCallback(
    async (input: { email: string; password: string; name?: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "credentials", ...input }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not sign in.")
      setPreviewMode(data.previewMode)
      setUser(data.user)
      return data.user as SessionUser
    },
    []
  )

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      previewMode,
      user,
      loading,
      refresh,
      loginSimulated,
      loginWithCredentials,
      logout,
    }),
    [
      previewMode,
      user,
      loading,
      refresh,
      loginSimulated,
      loginWithCredentials,
      logout,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
