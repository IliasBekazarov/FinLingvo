import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar    from './Sidebar'
import MobileNav  from './MobileNav'
import TopBar     from './TopBar'
import { useAuthStore } from '@/store/authStore'

export default function AppLayout() {
  const [sideOpen, setSideOpen] = useState(false)
  const refreshUser = useAuthStore(s => s.refreshUser)

  // Sync fresh user data (incl. progress) from DB on every app load
  useEffect(() => { refreshUser() }, [])

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Overlay */}
      {sideOpen && (
        <div
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[199] md:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      <Sidebar open={sideOpen} onClose={() => setSideOpen(false)} />

      <div className="flex-1 md:ml-[240px] flex flex-col">
        <TopBar onMenuClick={() => setSideOpen(true)} />
        {/* pb-nav on mobile accounts for MobileNav height + iOS safe-area */}
        <main className="flex-1 pb-nav md:pb-6">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
