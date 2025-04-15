import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(_: Request, context: { params: any }) {
  const { id } = context.params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role_id, organization_id')
    .eq('id', user.id)
    .single()

  if (!profile) return new Response('No profile found', { status: 400 })

  const { data: roleData } = await supabase
    .from('roles')
    .select('name')
    .eq('id', profile.role_id)
    .single()

  if (roleData?.name !== 'project manager') return new Response('Unauthorized', { status: 403 })

  // 1. Eliminar archivos del storage
  const { data: files } = await supabase
  .from('project_files')
  .select('path')
  .eq('project_id', id)

  if (files && files.length > 0) {
    const paths = files.map(f => {
      const url = f.path
      return url.includes('/object/') ? url.split('/object/')[1].split('/').slice(1).join('/') : url
    })

    const { error: storageError } = await supabase.storage.from('project-files').remove(paths)

    if (storageError) {
      console.error('Error deleting files from storage:', storageError.message)
      return new Response('Failed to delete files from storage', { status: 500 })
    }
  }


  // 2. Eliminar relaciones
  await supabase.from('project_files').delete().eq('project_id', id)
  await supabase.from('project_contributors').delete().eq('project_id', id)

  // Agregá más deletes si hay otras relaciones: feedback, comentarios, etc.

  // 3. Eliminar el proyecto
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return new Response('Error deleting project', { status: 500 })

  return new Response('OK', { status: 200 })
}
