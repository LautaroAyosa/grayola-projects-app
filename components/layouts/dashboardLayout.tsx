'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-toastify'


type Props = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  const links = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/projects', label: 'Projects' },
    { href: '/dashboard/settings', label: 'Settings' },
  ]

  const logout = async () => {
    await toast.promise(
      supabase.auth.signOut(),
      {
        pending: 'Logging out...',
        success: 'Logged out successfully',
        error: 'Logout failed'
      }
    )
    router.push('/login')
  }

  return (
    <div className="bg-gray-50 text-gray-900">
      <main className="flex w-full min-h-screen">
        {/* Sidebar */}
        <aside
          className={`
            ${collapsed ? 'w-[72px]' : 'w-[240px]'}
            fixed top-0 left-0 h-screen
            bg-white border-r shadow-sm hidden sm:flex flex-col transition-all duration-300
          `}
        >
          <div className={`flex items-center justify-between border-b max-h-15  ${collapsed ? "px-3 py-4" : "px-4 py-4" }`}>
            <Link href="/dashboard">
            <Image
              src={collapsed ? "/Grayola-Logo-Bird-removebg-preview.png" : "/Grayola-Logo-SVG.svg"}
              alt="Grayola Logo"
              height={collapsed ? 20 : 40}
              width={collapsed ? 20 : 120}
              className="object-contain"
            />
            </Link>
            {!collapsed && (
              <button onClick={() => setCollapsed(true)} className="ml-auto text-gray-400 hover:text-black cursor-pointer">
                <X size={20} />
              </button>
            )}
            {collapsed && (
              <button onClick={() => setCollapsed(false)} className="ml-auto text-gray-400 hover:text-black cursor-pointer">
                <Menu size={20} />
              </button>
            )}
          </div>

          <nav className="flex-1 font-fg-wide text-sm space-y-1">
            {links.map(({ href, label }) => {
              const isActive = href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)

              return (
              <Link
                key={href}
                href={href}
                className={`block px-4 py-3 transition whitespace-nowrap overflow-hidden ${
                  isActive
                    ? 'bg-black text-white font-semibold'
                    : 'text-gray-700 hover:text-brand hover:bg-gray-100'
                }`}                
              >
                {collapsed ? label.charAt(0) : label}
              </Link>

          )})}
          </nav>

          <button
            onClick={logout}
            className={`
              flex items-center justify-center hover:text-white cursor-pointer
              ${collapsed ? 'p-4' : 'p-6'}
              text-sm text-black hover:text-white hover:bg-red-600 border-t w-full transition 
            `}
          >
            {collapsed ? (
              <LogOut size={20} className="" />
            ) : (
              'Logout'
            )}
          </button>
        </aside>

        {/* Mobile sidebar */}
        <div className="sm:hidden fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center justify-between px-4 py-3 border-b">
          <Image src="/Grayola-Logo-SVG.svg" alt="Grayola Logo" width={100} height={40} />
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="sm:hidden fixed inset-0 z-40 bg-white p-6 flex flex-col justify-between">
            <div className='mt-10 overflow-y-auto'>
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`block px-3 py-3 text-sm ${
                    pathname === href
                      ? 'bg-brand/10 text-brand font-semibold'
                      : 'text-gray-700 hover:text-brand hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
            <button className="text-xs text-black hover:text-white hover:bg-red-600 p-4 border-t cursor-pointer w-full" onClick={logout}>
              Logout
            </button>
          </div>
        )}

        {/* Main content */}
        <section
          className={`
            flex-1 px-6 py-10 max-w-full overflow-x-hidden overflow-y-auto h-screen
            mt-[56px] sm:mt-0 transitions-all duration-200
            ${collapsed ? 'sm:ml-[72px]' : 'sm:ml-[240px]'}
          `}
        >
          {children}
        </section>
      </main>
    </div>
  )
}
