import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProjectsList from '@/components/ui/projectsList'

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <ProjectsList />
    </div>
  )
}
