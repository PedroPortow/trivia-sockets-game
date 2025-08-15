import ProtectedRoute from '@/routes/ProtectedRoute'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginScreen, RoomsScreen } from './pages'
import GameScreen from './pages/GameScreen'
import ResultsScreen from './pages/ResultsScreen'
import RoomLobbyScreen from './pages/RoomLobbyScreen'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/rooms" element={<RoomsScreen />}  />
        <Route path="/rooms/:roomId" element={<RoomLobbyScreen />} />
        <Route path="/rooms/:roomId/game" element={<GameScreen />} />
        <Route path="/rooms/:roomId/game/result" element={<ResultsScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
