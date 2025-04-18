'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Step2() {
  const router = useRouter()
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('')

  useEffect(() => {
    const loadRoles = async () => {
      const { data } = await supabase.from('roles').select('*')
      setRoles(data || [])
    }
    loadRoles()
  }, [])

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
    localStorage.setItem('role_id', selectedRole)
    router.push('/complete-profile/step3')
  }

  return (
    <div className="space-y-8 font-fg-wide">
      <div>
        <h1 className="text-3xl font-fg-xwide text-gray-800">What&apos;s your role?</h1>
        <p className="text-gray-600 mt-2">Select the role that best describes how you&apos;ll use Grayola.</p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="grid gap-4">
          {roles.map((role) => (
            <button
              type="button"
              key={role.id}
              className={`border rounded-lg px-4 py-3 text-left transition hover:border-gray-400 ${
                selectedRole === role.id ? 'bg-green-200 border-green-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <span className="capitalize font-semibold">{role.name}</span>
            </button>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-black text-white hover:opacity-90 py-5"
          disabled={!selectedRole}
        >
          Continue
        </Button>
      </form>
    </div>
  )
}
