'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type Org = { id: string; name: string }

export default function Step0() {
  const router = useRouter()
  const [orgName, setOrgName] = useState('')
  const [orgs, setOrgs] = useState<Org[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null)
  const [createNew, setCreateNew] = useState(false)
  const [loading, setLoading] = useState(false)

  const perPage = 5

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase.from('organizations').select('*').order('name', { ascending: true })
      setOrgs(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = orgs.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  )

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage)

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    let orgId = selectedOrg?.id ?? null

    if (createNew && orgName.trim()) {
      const { data, error } = await supabase
        .from('organizations')
        .insert([{ name: orgName.trim() }])
        .select()
        .single()

      if (error) {
        console.error(error.message)
        return
      }
      orgId = data.id
    }

    if (orgId) {
      localStorage.setItem('organization_id', orgId)
      router.push('/complete-profile/step1')
    }
  }

  return (
    <div className="space-y-8 font-fg-wide">
      <div>
        <h1 className="text-3xl font-fg-xwide text-gray-800">Join an organization</h1>
        <p className="text-gray-600 mt-2">
          {createNew ? 'Create a new organization to get started.' : 'Select your organization from the list.'}
        </p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {!createNew && (
          <>
            <Input
              placeholder="Search organizations"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
            />

            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2 w-12 text-center">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((org) => (
                    <tr
                      key={org.id}
                      className={`border-t cursor-pointer ${selectedOrg?.id === org.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedOrg(selectedOrg?.id === org.id ? null : org)}
                    >
                      <td className="px-4 py-2">{org.name}</td>
                      <td className="px-4 py-2 w-12 text-center">
                        <Button
                          type="button"
                          variant={selectedOrg?.id === org.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedOrg(selectedOrg?.id === org.id ? null : org)
                          }}
                        >
                          {selectedOrg?.id === org.id ? 'Unselect' : 'Choose'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <p className="text-sm p-4 text-gray-500">Loading...</p>}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {page + 1} of {Math.ceil(filtered.length / perPage)}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * perPage >= filtered.length}
              >
                Next
              </Button>
            </div>
          </>
        )}

        {createNew && (
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization name</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter new organization name"
              required
            />
          </div>
        )}

        <p className="text-sm text-center text-gray-500">
          {createNew ? (
            <>
              Already have one?{' '}
              <button
                type="button"
                className="underline text-brand cursor-pointer"
                onClick={() => {
                  setCreateNew(false)
                  setOrgName('')
                }}
              >
                Select existing
              </button>
            </>
          ) : (
            <>
              Don’t see it?{' '}
              <button
                type="button"
                className="underline text-brand cursor-pointer"
                onClick={() => {
                  setCreateNew(true)
                  setSelectedOrg(null)
                  setSearch('')
                }}
              >
                Create new
              </button>
            </>
          )}
        </p>

        <Button
          type="submit"
          className="w-full bg-black text-white hover:opacity-90 py-5 cursor-pointer"
          disabled={createNew ? !orgName.trim() : !selectedOrg}
        >
          Continue
        </Button>
      </form>
    </div>
  )
}
