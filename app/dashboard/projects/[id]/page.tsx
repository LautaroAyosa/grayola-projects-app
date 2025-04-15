import ProjectActions from '@/components/ui/projectActions';
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserIcon, FileIcon } from 'lucide-react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';


type Role = { name: string }

type Contributor = {
  id: string
  name: string
  role?: string
}


export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string[] }> }) {
  const id = (await params).id;

  const supabase = await createServerSupabaseClient()
  const {
      data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
      .from('profiles')
      .select('role_id, organization_id')
      .eq('id', user.id)
      .single()

  if (!profile) redirect('/auth/complete-profile/step0')

  const { data: roleData } = await supabase
      .from('roles')
      .select('name')
      .eq('id', profile.role_id)
      .single()

  const role = roleData?.name

  const { data: project, error } = await supabase
      .from('projects')
      .select('*, project_files(path)')
      .eq('id', id)
      .single()

  if (error || !project) {
      return (
      <div className='w-full flex flex-col justify-center items-center gap-4'>
          <p className="text-center mt-20 text-gray-500">Project not found.</p>
          <Link href="/dashboard/projects">
              <Button className="bg-black text-white hover:opacity-90 cursor-pointer">Back to Proyects</Button>
          </Link>
      </div>
      )
  }

  const files = []
  if (project.project_files?.length) {
      for (const file of project.project_files) {
      const { data: signed } = await supabase.storage
          .from('project-files')
          .createSignedUrl(file.path, 60 * 60)
      if (signed?.signedUrl) {
          files.push({
          name: file.path.split('/').pop(),
          url: signed.signedUrl,
          })
      }
      }
  }

  const { data: contribs } = await supabase
  .from('project_contributors')
  .select('user_id')
  .eq('project_id', project.id)

  const userIds = contribs?.map(c => c.user_id) || []

  let contributors: Contributor[] = []
  if (userIds.length > 0) {
  const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, roles(name)')
      .in('id', userIds)

  contributors = (profiles || []).map((p): Contributor => ({
      id: p.id,
      name: p.full_name,
      role: Array.isArray(p.roles)
          ? p.roles[0]?.name
          : (p.roles as Role | null)?.name ?? undefined,
      }))
  }


  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-fg-xwide text-gray-800">{project.title}</h1>
        <p className="text-gray-600 mt-2">{project.description}</p>
        <p className="text-sm text-gray-400 mt-2">
          Created: {new Date(project.created_at).toLocaleString()}
        </p>
      </div>

      {files.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Files</h2>
          <ul className="divide-y text-sm">
            {files.map((file) => (
              <li key={file.name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 text-blue-600">
                  <FileIcon size={18} />
                  <a
                    href={file.url}
                    download={file.name}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {file.name}
                  </a>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-500 hover:underline"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contributors.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Contributors</h2>
          <ul className="space-y-3 text-sm">
            {contributors.map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <UserIcon size={18} className="text-gray-400" />
                <div>
                  <p className="text-gray-800 font-medium">{c.name || '-'}</p>
                  <p className="text-xs text-gray-500 capitalize">{c.role || 'Contributor'}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {role === 'project manager' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Actions</h2>
            <ProjectActions projectId={project.id} />
        </div>
      )}
    </div>
  )
}
