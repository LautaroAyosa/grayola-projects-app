import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'
import EditProject from './EditProjectPage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) {
    return <p className="mt-20 text-center text-red-500">Project not found or without access.</p>
  }

  return <EditProject project={project} />
}