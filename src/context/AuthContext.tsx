import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  user: any
  role: string | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      console.log("FETCH PROFILE START")

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      console.log("FETCH PROFILE RESULT:", data)

      if (error) throw error

      return data?.role || 'user'
    } catch (err) {
      console.error(err)
      return 'user'
    }
  }

  // 🔥 1. ascolta auth (SOLO user)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AUTH EVENT:", event)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔥 2. quando cambia user → carica profilo
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      setLoading(true)

      const userRole = await fetchProfile(user.id)
      setRole(userRole)

      setLoading(false)
    }

    loadProfile()
  }, [user])

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)