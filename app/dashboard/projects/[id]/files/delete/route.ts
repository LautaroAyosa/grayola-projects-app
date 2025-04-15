import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { path, project_id } = await req.json()
  const supabase = await createServerSupabaseClient()

  await supabase.storage.from('project-files').remove([path])
  await supabase.from('project_files').delete().eq('project_id', project_id).eq('path', path)

  return new Response('Deleted', { status: 200 })
}
