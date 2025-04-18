'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Org = { id: string; name: string }
type Role = { id: string; name: string }

export default function Step3() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [organization, setOrganization] = useState<Org | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const orgId = localStorage.getItem('organization_id')
      const roleId = localStorage.getItem('role_id')
      const name = localStorage.getItem('full_name')

      setFullName(name || '')

      const [{ data: org }, { data: role }] = await Promise.all([
        supabase.from('organizations').select('*').eq('id', orgId).single(),
        supabase.from('roles').select('*').eq('id', roleId).single(),
      ])

      setOrganization(org || null)
      setRole(role || null)
      setLoading(false)
    }

    loadData()
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('User not found.')
      return
    }

    const organization_id = localStorage.getItem('organization_id')
    const role_id = localStorage.getItem('role_id')

    const { error } = await supabase.from('profiles').insert([
      {
        id: user.id,
        full_name: fullName,
        role_id,
        organization_id,
      },
    ])

    if (error) {
      setError(error.message)
      setSubmitting(false)
    } else {
      localStorage.clear()
      setTimeout(() => router.push('/dashboard'), 500) // gives time for animation
    }
  }

  const restart = () => {
    localStorage.clear()
    router.push('/complete-profile/step0')
  }

  return (
    <>
      {!submitting && (
        <div className="space-y-8 font-fg-wide">
          <div>
            <h1 className="text-3xl font-fg-xwide text-gray-800">Confirm your profile</h1>
            <p className="text-gray-600 mt-2">Review your information before finishing setup.</p>
          </div>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : (
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex justify-between items-center border rounded-md px-4 py-3">
                <div>
                  <p className="text-xs text-gray-500">Organization</p>
                  <p className="text-base font-medium">{organization?.name}</p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-black cursor-pointer"
                  onClick={() => router.push('/complete-profile/step0')}
                >
                  Edit
                </Button>
              </div>

              <div className="flex justify-between items-center border rounded-md px-4 py-3">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-base font-medium">{fullName}</p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-black cursor-pointer"
                  onClick={() => router.push('/complete-profile/step1')}
                >
                  Edit
                </Button>
              </div>              

              <div className="flex justify-between items-center border rounded-md px-4 py-3">
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-base font-medium capitalize">{role?.name}</p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-black cursor-pointer"
                  onClick={() => router.push('/complete-profile/step2')}
                >
                  Edit
                </Button>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSubmit}
            className="w-full bg-black text-white hover:opacity-90 py-5 cursor-pointer"
          >
            Finish
          </Button>
          <Button
            onClick={restart}
            variant="ghost"
            className="text-red-500 border-red-500 border-1 hover:bg-red-500 hover:text-white py-5 cursor-pointer"
          >
            Start over
          </Button>
        </div>
      </div>
      )}
    </>
  )
}
