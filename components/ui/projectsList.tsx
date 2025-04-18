'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ConfirmModal from './confirmModal'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'


type ProjectFile = { path: string }
type Project = {
  id: string
  title: string
  description: string
  created_at: string
  project_files: ProjectFile[]
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [role, setRole] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role_id, organization_id')
        .eq('id', user.id)
        .single()

      const { data: roleData } = await supabase
        .from('roles')
        .select('name')
        .eq('id', profile?.role_id)
        .single()

      const roleName = roleData?.name || null
      setRole(roleName)

      let result: Project[] = []

      // if (roleName === 'client') {
      //   const { data } = await supabase
      //     .from('projects')
      //     .select('*, project_files(path)')
      //     .eq('created_by', user.id)
      //     .order('created_at', { ascending: false })
      //   result = data || []
      // } else 
      if (roleName === 'project manager' || roleName === 'client') {
        const { data } = await supabase
          .from('projects')
          .select('*, project_files(path)')
          .eq('organization_id', profile?.organization_id)
          .order('created_at', { ascending: false })
        result = data || []
      } else if (roleName === 'designer') {
        const { data: contribs } = await supabase
          .from('project_contributors')
          .select('project_id')
          .eq('user_id', user.id)

        const projectIds = contribs?.map(c => c.project_id) || []
        if (projectIds.length > 0) {
          const { data } = await supabase
            .from('projects')
            .select('*, project_files(path)')
            .in('id', projectIds)
            .order('created_at', { ascending: false })
          result = data || []
        }
      }

      setProjects(result)
      setLoading(false)
    }

    load()
  }, [supabase])

  const handleDelete = async () => {
    if (!selectedProjectId) return
  
    toast.promise(
      fetch(`/dashboard/projects/${selectedProjectId}/delete`, { method: 'POST' }),
      {
        pending: 'Deleting project...',
        success: 'Project deleted!',
        error: 'Failed to delete project.',
      }
    )
      
    setProjects(prev => prev.filter(p => p.id !== selectedProjectId))
    setConfirmOpen(false)
    setSelectedProjectId(null)
  } 


  const filtered = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-fg-xwide text-gray-800">Projects</h1>
        </div>
        <SkeletonList />
      </>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-fg-xwide text-gray-800">Projects</h1>
        {(role === 'client' || role === 'project manager') && (
          <Link href="/dashboard/projects/create">
            <Button className="bg-black text-white hover:opacity-90 cursor-pointer">Create New</Button>
          </Link>
        )}
      </div>

      <Input
        placeholder="Search projects by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mt-4"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm mt-4">No matches found.</p>
      ) : (
        <div className="flex flex-col gap-2 mt-4">
          {filtered.map((project) => {
            const createdAt = new Date(project.created_at).toLocaleDateString()
            return (
              <div key={project.id} className="border rounded-lg bg-white shadow-sm flex flex-col">
                <div key={project.id} className="border rounded-lg bg-white shadow-sm w-full flex">
                  <div className="flex w-[calc(100%-60px)]">
                    <Link href={`/dashboard/projects/${project.id}`} className="flex flex-col w-full h-full border-r min-w-0">
                      <div className="hover:bg-gray-100 cursor-pointer p-6 h-full">
                        <h2
                          className="text-lg font-semibold text-gray-800 break-words"
                          title={project.title}
                        >
                          {project.title.length > 60
                            ? project.title.slice(0, 57) + '...'
                            : project.title}
                        </h2>
                        <p
                          className="text-sm text-gray-600 mt-1 break-words"
                          title={project.description}
                        >
                          {project.description.length > 100
                            ? project.description.slice(0, 97) + '...'
                            : project.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-3">Created: {createdAt}</p>
                      </div>
                    </Link>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 p-2 w-[60px] shrink-0">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Button variant="outline" className="w-full text-sm cursor-pointer border-gray-300 hover:bg-black hover:border-black hover:text-white">
                        <Eye size={18} />
                      </Button>
                    </Link>
                    {(role === 'client' || role === 'project manager') && (
                      <>
                        <Link href={`/dashboard/projects/${project.id}/edit`}>
                          <Button variant="secondary" className="w-full text-sm cursor-pointer border border-gray-300 hover:bg-black hover:border-black hover:text-white">
                            <Pencil size={18} />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          className="w-full text-sm cursor-pointer hover:bg-red-500"
                          onClick={() => {
                            setSelectedProjectId(project.id)
                            setConfirmOpen(true)
                          }}
                        >
                          <Trash2 size={18} className="text-white" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {project.project_files?.length > 0 && (
                  <div className="px-6 py-4 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Files</h3>
                    <ul className="text-sm space-y-1">
                      {project.project_files.map((file) => {
                        const publicUrl = supabase.storage
                          .from('project-files')
                          .getPublicUrl(file.path).data.publicUrl
                        return (
                          <li key={file.path}>
                            <a
                              href={publicUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {file.path.split('/').pop()}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      {confirmOpen && (
        <ConfirmModal
          title="Delete project?"
          description="This action cannot be undone."
          confirmLabel="Yes, delete"
          cancelLabel="Cancel"
          danger
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}

    </>
  )
}

// A small skeleton placeholder
function SkeletonList() {
  return (
    <div className="grid gap-4 mt-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg bg-white p-6 shadow-sm animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
