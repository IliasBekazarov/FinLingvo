import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import AppLayout   from '@/components/layout/AppLayout'
import Landing     from '@/pages/Landing'
import Learn       from '@/pages/Learn'
import Lesson      from '@/pages/Lesson'
import Result      from '@/pages/Result'
import Leaderboard from '@/pages/Leaderboard'
import Profile     from '@/pages/Profile'
import Shop        from '@/pages/Shop'
import Settings    from '@/pages/Settings'

function Require({ children }) {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn())
  return isLoggedIn ? children : <Navigate to="/" replace />
}

function GuestOnly({ children }) {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn())
  return isLoggedIn ? <Navigate to="/learn" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GuestOnly><Landing /></GuestOnly>} />

      {/* Full-screen pages — no AppLayout (no TopBar / MobileNav) */}
      <Route path="/lesson" element={<Require><Lesson /></Require>} />
      <Route path="/result"  element={<Require><Result /></Require>} />

      {/* Main app with sidebar + topbar */}
      <Route element={<Require><AppLayout /></Require>}>
        <Route path="/learn"       element={<Learn />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile"     element={<Profile />} />
        <Route path="/shop"        element={<Shop />} />
        <Route path="/settings"    element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
