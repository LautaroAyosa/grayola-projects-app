import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {redirect('/dashboard')}
  
  return ( 
    <div className='auth-background min-h-[calc(100vh-72px)] m-0 flex justify-center items-center'>
      {children}
    </div>
  );
}
