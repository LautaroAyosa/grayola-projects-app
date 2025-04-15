import { createServerSupabaseClient } from '@/lib/supabase/server'
import Navbar from '@/components/frontend/navbar'
import '../globals.css'

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const supabase = await createServerSupabaseClient()
    const {
    data: { user },
    } = await supabase.auth.getUser()

  return (
    <div>
      <Navbar user={user} />
      {children}
    </div>
  )
}
