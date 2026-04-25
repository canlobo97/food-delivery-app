import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminRoute({ children }: any) {
  const { user, role, loading } = useAuth()

  // 🔥 aspetta completamente auth + ruolo
  if (loading || (user && role === null)) {
    return <div>Loading...</div>
  }

  if (!user) return <Navigate to="/login" />

  if (role !== 'admin') return <Navigate to="/" />

  return children
}