'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const message = useSearchParams().get('message')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError(loginError.message)
      toast.error(loginError.message)
      setIsLoading(false)
      return
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('Failed to fetch user info.')
      toast.error('Failed to fetch user info.')
      setIsLoading(false)
      return
    }

    toast.success('Logged in successfully!')

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      router.push('/complete-profile/step0')
    } else {
      router.push('/dashboard')
    }

    setIsLoading(false)
  }

  return (
    <div className="max-w-lg max-h-fit flex flex-col justify-center content-center px-8 py-8 glass rounded-4xl">
      <h1 className="text-3xl font-fg-xwide text-gray-800 mb-6">Welcome back</h1>

      {message === 'account-created' && (
        <p className="text-green-600 text-sm font-fg-wide mb-4">
          Account created successfully. Please log in.
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-5 font-fg-wide">
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
          {isLoading ? 'Logging in…' : 'Login'}
        </Button>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{' '}
          <Link href="/register" className="text-brand underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
