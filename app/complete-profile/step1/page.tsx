'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function Step1() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('full_name', name)
    router.push('/complete-profile/step2')
  }

  return (
    <div className="space-y-8 font-fg-wide">
      <div>
        <h1 className="text-3xl font-fg-xwide text-gray-800">What&apos;s your name?</h1>
        <p className="text-gray-600 mt-2">Let&apos;s personalize your account with your full name.</p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-gray-700">Full Name</Label>
          <Input
            id="full_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. María Rodríguez"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-black text-white hover:opacity-90 py-5"
          disabled={!name.trim()}
        >
          Continue
        </Button>
      </form>
    </div>
  )
}
