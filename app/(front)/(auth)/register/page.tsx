'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-toastify'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login?message=account-created`,
      },
    })

    if (error) {
      setError(error.message)
      toast.error(error.message)
    } else {
      setSuccess(true)
      toast.success('Confirmation email sent. Check your inbox.')
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 glass rounded-4xl p-8">
        <div className='flex justify-center'>
          <Image
            src={'/success-icon-10.png'}
            height={64}
            width={64}
            alt='success icon'
          />
        </div>
        <h1 className="text-3xl font-fg-xwide text-gray-800">Almost there!</h1>
        <p className="text-gray-600 font-fg-wide">
          We’ve sent you a confirmation email. Please verify your account to continue.
        </p>
        <p className="text-gray-600 font-fg-wide">
          Once verified, you can{' '}
          <Link href="/login?message=account-created" className="underline text-brand">
            log in here
          </Link>.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-lg max-h-fit flex flex-col justify-center content-center px-8 py-8 glass rounded-4xl">
      <h1 className="text-3xl font-fg-xwide text-gray-800 mb-6">Create your account</h1>
      <form onSubmit={handleRegister} className="space-y-5 font-fg-wide">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-gray-700">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand text-black hover:opacity-90 transition grayola-button"
        >
          {isLoading ? 'Registering…' : 'Register'}
        </Button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-brand underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
