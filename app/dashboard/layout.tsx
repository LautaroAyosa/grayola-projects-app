'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Layout from '@/components/layouts/dashboardLayout'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, role_id, organization_id')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        router.push('/complete/profile/step0')
        return
      }

      if (!profile.organization_id) {
        router.push('/complete/profile/step0')
        return
      }

      if (!profile.full_name) {
        router.push('/complete/profile/step1')
        return
      }

      if (!profile.role_id) {
        router.push('/complete/profile/step2')
        return
      }
    }

    checkAuth()
  }, [router])

  return <Layout>{children}</Layout>
}
