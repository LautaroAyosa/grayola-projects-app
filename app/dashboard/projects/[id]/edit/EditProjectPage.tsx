'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'react-toastify'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ProjectFileManager from '@/components/ui/projectFileManager'
import ContributorsTable from '@/components/ui/contributorsTable'
import Link from 'next/link'

export default function EditProject({
  project,
}: {
  project: {
    id: string
    title: string
    description: string
    organization_id: string | null
  }
}) {
    const router = useRouter()

    const [title, setTitle] = useState(project.title)
    const [description, setDescription] = useState(project.description)
    const [organizationId] = useState(project.organization_id || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
      
        const updateProject = async () => {
          const { data, error } = await supabase
            .from('projects')
            .update({ title, description })
            .eq('id', project.id)
            .select()
      
          return { data, error }
        }
      
        const result = await toast
          .promise(updateProject(), {
            pending: 'Saving changes...',
            success: 'Project updated!',
            error: 'Error saving changes.',
          })
          .then(({ data, error }) => {
            if (!error) {
              router.push(`/dashboard/projects/${project.id}`)
            }
            return { data, error }
          })
      
        if (result.error) {
          console.error('Update error:', result.error.message)
        }
    }
      

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-fg-xwide text-gray-800">Edit Project</h1>
        <p className="text-sm text-gray-500">
          Update the project details and manage contributors.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Files</h2>
          <ProjectFileManager projectId={project.id} />
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Contributors</h2>
          <ContributorsTable
            organizationId={organizationId}
            projectId={project.id}
          />
        </div>

        <div className="flex justify-between">
          <Link href={`/dashboard/projects/${project.id}`}>
            <Button className="bg-white text-black border border-black hover:bg-black rounded-lg hover:text-white cursor-pointer">
              Go Back
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-black text-white hover:bg-green-600 px-6 cursor-pointer"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

