import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (!token) {
    return <Navigate to="/auth" state={{ from: location, mode: 'login' }} replace />
  }

  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
