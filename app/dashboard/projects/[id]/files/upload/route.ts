import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: Promise<{ id: string[] }> }) {
  const id = (await params).id;
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return new Response('No file', { status: 400 })

  const supabase = await createServerSupabaseClient()
  const filePath = `${id}/${file.name}`

  const { error: uploadError } = await supabase
    .storage
    .from('project-files')
    .upload(filePath, file, { upsert: true })

  if (uploadError) return new Response(uploadError.message, { status: 500 })

  const { error: insertError } = await supabase
    .from('project_files')
    .insert([{ project_id: id, path: filePath }])

  if (insertError) return new Response(insertError.message, { status: 500 })

  return NextResponse.json({ path: filePath })
}
