import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function uploadProjectFile(projectId: string, file: File) {
  const supabase = await createServerSupabaseClient()
  const filePath = `${projectId}/${file.name}`

  const { error: uploadError } = await supabase
    .storage
    .from('project-files')
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw new Error(uploadError.message)

  const { error: insertError } = await supabase
    .from('project_files')
    .insert([{ project_id: projectId, path: filePath }])

  if (insertError) throw new Error(insertError.message)

  return filePath
}

export async function deleteProjectFile(projectId: string, path: string) {
  const supabase = await createServerSupabaseClient()

  const { error: storageError } = await supabase
    .storage
    .from('project-files')
    .remove([path])
  if (storageError) throw new Error(storageError.message)

  const { error: dbError } = await supabase
    .from('project_files')
    .delete()
    .eq('project_id', projectId)
    .eq('path', path)
  if (dbError) throw new Error(dbError.message)
}

export async function deleteAllProjectFiles(projectId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: files } = await supabase
    .from('project_files')
    .select('path')
    .eq('project_id', projectId)

  if (!files || files.length === 0) return

  const paths = files.map(f => f.path)

  await supabase.storage.from('project-files').remove(paths)
  await supabase.from('project_files').delete().eq('project_id', projectId)
}
