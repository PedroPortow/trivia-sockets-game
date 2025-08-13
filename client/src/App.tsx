import ProtectedRoute from '@/routes/ProtectedRoute'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginScreen, RoomsScreen } from './pages'
import RoomLobbyScreen from './pages/RoomLobbyScreen'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/rooms" element={<RoomsScreen />} />
        <Route path="/rooms/:roomId" element={<RoomLobbyScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
