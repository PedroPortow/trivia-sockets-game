import { usePlayer } from '@/hooks'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function ProtectedRoute() {
  const { player } = usePlayer()
  const location = useLocation()

  if (!player?.id) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
