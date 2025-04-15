'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'

type Props = {
  projectId: string
  organizationId: string
}

type Member = {
  id: string
  full_name: string
  email?: string
  role_id: string
  roles?: { name: string }
  assigned: boolean
}

export default function ContributorsTable({ projectId, organizationId }: Props) {
  const [members, setMembers] = useState<Member[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const [{ data: users }, { data: assigned }] = await Promise.all([
        supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            role_id,
            roles(name)
          `)
          .eq('organization_id', organizationId)
          .order('full_name', { ascending: true }),

        supabase
          .from('project_contributors')
          .select('user_id')
          .eq('project_id', projectId)
      ])

      const assignedUserIds = assigned?.map(a => a.user_id) || []

      const cleaned = (users || []).map((user): Member => ({
        ...user,
        roles: Array.isArray(user.roles) ? user.roles[0] : user.roles,
        assigned: assignedUserIds.includes(user.id),
      }))

      setMembers(cleaned)
      setLoading(false)
    }

    load()
  }, [projectId, organizationId])

  const toggleAssignment = async (userId: string, assigned: boolean) => {
    const action = assigned ? 'Unassigning...' : 'Assigning...'
    const successMsg = assigned ? 'User unassigned' : 'User assigned'
    const errorMsg = assigned ? 'Failed to unassign' : 'Failed to assign'

    await toast.promise(
      (async () => {
        if (assigned) {
          await supabase
            .from('project_contributors')
            .delete()
            .eq('user_id', userId)
            .eq('project_id', projectId)
        } else {
          await supabase
            .from('project_contributors')
            .insert([{ user_id: userId, project_id: projectId }])
        }

        const updated = members.map((m) =>
          m.id === userId ? { ...m, assigned: !assigned } : m
        )
        setMembers(updated)
      })(),
      {
        pending: action,
        success: successMsg,
        error: errorMsg
      }
    )
  }

  const filtered = members.filter((u) => {
    const nameMatch = u.full_name?.toLowerCase().includes(search.toLowerCase())
    const roleMatch = roleFilter ? u.roles?.name === roleFilter : true
    return nameMatch && roleMatch
  })

  return (
    <div className="space-y-4 mt-10">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          className="border rounded p-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="client">Cliente</option>
          <option value="project manager">Project Manager</option>
          <option value="designer">Diseñador</option>
        </select>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-3 py-2">Name</th>
            <th className="text-left px-3 py-2">Email</th>
            <th className="text-left px-3 py-2">Role</th>
            <th className="text-left px-3 py-2">Assigned</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-3 py-2">{user.full_name || '-'}</td>
              <td className="px-3 py-2">{user.email || '-'}</td>
              <td className="px-3 py-2 capitalize">{user.roles?.name || '-'}</td>
              <td className="px-3 py-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className='cursor-pointer'
                  onClick={() => toggleAssignment(user.id, user.assigned)}
                >
                  {user.assigned ? 'Unassign' : 'Assign'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
    </div>
  )
}
