import { usePlayer } from '@/hooks'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function ProtectedRoute() {
  const { name } = usePlayer() || {}
  const location = useLocation()

  if (!name?.trim()) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
