import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.organization_id) return redirect('/complete-profile/step0')
  if (!profile.role_id) return redirect('/complete-profile/step1')

  const { data: role } = await supabase
    .from('roles')
    .select('name')
    .eq('id', profile.role_id)
    .single()

  if (!role) return redirect('/complete-profile/step1')

  const { data: organization } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', profile.organization_id)
    .single()

  if (!organization) return redirect('/complete-profile/step0')

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-fg-xwide text-gray-800">Welcome back 👋</h1>
        <p className="text-gray-600 font-fg-wide">
          You&apos;re logged in as <strong>{user.email}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Organization</p>
          <p className="text-lg font-semibold text-gray-800">{organization.name}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Role</p>
          <Badge className="text-sm capitalize bg-brand text-black">{role.name}</Badge>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-fg-xwide text-gray-800">Your workspace</h2>
        <p className="text-sm text-gray-500 mt-1">
          Here you can manage your projects, team, and settings.
        </p>
      </div>
    </div>
  )
}
