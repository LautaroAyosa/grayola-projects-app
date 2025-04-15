'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import ContributorsTable from '@/components/ui/contributorsTable'
import { toast } from 'react-toastify'

export default function CreateProjectPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const router = useRouter()

  useEffect(() => {
    const loadOrg = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (!profile?.organization_id) {
        router.push('/auth/complete-profile/step0')
        return
      }
      setOrgId(profile.organization_id)
    }
    loadOrg()
  }, [router])

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !orgId) {
      setError('Not authorized or organization missing.')
      return
    }

    await toast.promise(
      (async () => {
        const { data: project, error: insertError } = await supabase
          .from('projects')
          .insert([{ title, description, created_by: user.id, organization_id: orgId }])
          .select()
          .single()

        if (insertError || !project) {
          throw new Error(insertError?.message || 'Project creation failed.')
        }

        setProjectId(project.id)

        if (files && files.length > 0) {
          for (const file of Array.from(files)) {
            const path = `${project.id}/${file.name}`
            const { error: uploadError } = await supabase.storage
              .from('project-files')
              .upload(path, file)

            if (uploadError) {
              throw new Error(uploadError.message)
            }

            await supabase.from('project_files').insert([{ project_id: project.id, path }])
          }
        }
      })(),
      {
        pending: 'Creating project...',
        success: 'Project created!',
        error: 'Project creation failed.'
      }
    )

    setStep(2)
  }

  const handleDone = () => {
    router.push('/dashboard/projects')
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      <div>
        <h1 className="text-3xl font-fg-xwide text-gray-800">Create Project</h1>
        <p className="text-sm text-gray-500">Add details and assign team members.</p>
      </div>

      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Files</label>
            <Input type="file" multiple onChange={e => setFiles(e.target.files)} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" className="bg-black text-white hover:bg-green-600 px-6 cursor-pointer">Next</Button>
          </div>
        </form>
      )}

      {step === 2 && projectId && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Assign Contributors</h2>
            <ContributorsTable projectId={projectId} organizationId={orgId!} />
          </div>
          <div className="flex justify-end">
            <Button className="bg-black text-white hover:bg-green-600 px-6 cursor-pointer" onClick={handleDone}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
