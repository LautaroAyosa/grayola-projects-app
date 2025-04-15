'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

const AuthContext = createContext<{ user: User | null; role: string | null }>({ user: null, role: null })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role_id')
          .eq('id', user.id)
          .single()

        if (profile?.role_id) {
          const { data: roleData } = await supabase
            .from('roles')
            .select('name')
            .eq('id', profile.role_id)
            .single()

          setRole(roleData?.name || null)
        }
      }
    }

    init()
  }, [])

  return <AuthContext.Provider value={{ user, role }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
