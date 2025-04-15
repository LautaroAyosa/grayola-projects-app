'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import SettingsSkeleton from '@/components/skeletons/settingsSkeleton'
import { toast } from 'react-toastify'

export default function SettingsPage() {
  const [fullName, setFullName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [roleName, setRoleName] = useState('')
  const [isPM, setIsPM] = useState(false)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email || '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role_id, organization_id')
        .eq('id', user.id)
        .single()

      if (!profile) return
      setFullName(profile.full_name || '')

      const [{ data: roleData }, { data: orgData }] = await Promise.all([
        supabase.from('roles').select('name').eq('id', profile.role_id).single(),
        supabase.from('organizations').select('name').eq('id', profile.organization_id).single()
      ])

      setRoleName(roleData?.name || '')
      setOrganization(orgData?.name || '')
      setIsPM(roleData?.name === 'project manager')
      setLoading(false)
    }

    load()
  }, [])

  const handleUpdateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const updateProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)
        .select()

        return { data, error }
    }

    await toast.promise(
      updateProfile(),
      {
        pending: 'Updating profile...',
        success: 'Profile updated!',
        error: 'Failed to update profile.'
      }
    )
  }

  if (loading) return <SettingsSkeleton />

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      <div>
        <h1 className="text-3xl font-fg-xwide text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile and organization settings.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Your Profile</h2>
        <div>
          <label className="text-sm text-gray-700 block mb-1">Full Name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-700 block mb-1">Email</label>
          <Input value={email} disabled />
        </div>
        <div>
          <label className="text-sm text-gray-700 block mb-1">Role</label>
          <Input value={roleName} name='role' disabled />
        </div>
        <div className="pt-2">
          <Button onClick={handleUpdateProfile} className='cursor-pointer'>Update Profile</Button>
        </div>
      </div>

      {isPM && (
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Organization Settings</h2>
          <div>
            <label className="text-sm text-gray-700 block mb-1">Organization Name</label>
            <Input value={organization} disabled />
          </div>
          <p className="text-sm text-gray-500">Feature: user management coming soon.</p>
        </div>
      )}
    </div>
  )
}
