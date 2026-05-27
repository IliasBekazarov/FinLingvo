import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar    from './Sidebar'
import MobileNav  from './MobileNav'
import TopBar     from './TopBar'
import { useAuthStore } from '@/store/authStore'

export default function AppLayout() {
  const refreshUser = useAuthStore(s => s.refreshUser)

  // Sync fresh user data (incl. progress) from DB on every app load
  useEffect(() => { refreshUser() }, [])

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar only — mobile uses bottom MobileNav */}
      <Sidebar />

      <div className="flex-1 md:ml-[240px] flex flex-col">
        <TopBar />
        {/* pb-nav on mobile accounts for MobileNav height + iOS safe-area */}
        <main className="flex-1 pb-nav md:pb-6">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
