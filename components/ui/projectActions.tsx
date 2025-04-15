'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import ConfirmModal from './confirmModal'
import { toast } from 'react-toastify'

interface ProjectActionsProps {
  projectId: string
}

export default function ProjectActions({ projectId }: ProjectActionsProps) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const deleteProject = async () => {
    const response = await fetch(`/dashboard/projects/${projectId}/delete`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Delete failed')
    }
  }

  const handleDelete = async () => {
    try {
      await toast.promise(deleteProject(), {
        pending: 'Deleting project...',
        success: 'Project deleted!',
        error: 'Failed to delete project.',
      })

      router.push('/dashboard/projects')
    } finally {
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/projects/${projectId}/edit`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Edit size={16} />
          Edit
        </Button>

        <Button
          variant="destructive"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>

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
