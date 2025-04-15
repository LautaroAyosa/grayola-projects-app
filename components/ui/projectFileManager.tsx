'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Upload, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

type Props = {
  projectId: string
}

export default function ProjectFileManager({ projectId }: Props) {
  const [files, setFiles] = useState<{ path: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFiles = async () => {
      const { data } = await supabase
        .from('project_files')
        .select('path')
        .eq('project_id', projectId)
      setFiles(data || [])
    }
    fetchFiles()
  }, [projectId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    await toast.promise(
      fetch(`/dashboard/projects/${projectId}/files/upload`, {
        method: 'POST',
        body: formData,
      }).then(async res => {
        if (!res.ok) {
          const error = await res.text()
          throw new Error(error)
        }
        const { path } = await res.json()
        setFiles(prev => [...prev, { path }])
      }),
      {
        pending: 'Uploading file...',
        success: 'File uploaded successfully.',
        error: 'Failed to upload file.',
      }
    )
  
    setLoading(false)
  }

  const handleDelete = async (path: string) => {
    setLoading(true)
    await toast.promise(
      fetch(`/dashboard/projects/${projectId}/files/delete`, {
        method: 'POST',
        body: JSON.stringify({ path, project_id: projectId }),
        headers: { 'Content-Type': 'application/json' },
      }).then(async res => {
        if (!res.ok) {
          const error = await res.text()
          throw new Error(error)
        }
        setFiles(prev => prev.filter(f => f.path !== path))
      }),
      {
        pending: 'Deleting file...',
        success: 'File deleted successfully.',
        error: 'Failed to delete file.',
      }
    )  
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label
          htmlFor="fileUpload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 cursor-pointer text-sm"
        >
          <Upload size={16} />
          Upload file
        </label>
        <input
          id="fileUpload"
          type="file"
          onChange={handleUpload}
          className="hidden"
          disabled={loading}
        />
        {loading && <Loader2 className="animate-spin text-gray-500" size={18} />}
      </div>

      <ul className="space-y-2">
        {files.map(file => (
          <li
            key={file.path}
            className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded shadow-sm"
          >
            <span className="truncate text-sm text-gray-800">
              {file.path.split('/').pop()}
            </span>
            <button
              type="button"
              onClick={() => handleDelete(file.path)}
              className="text-red-600 hover:text-red-800"
              disabled={loading}
              title="Delete file"
            >
              <Trash2 size={16} className='cursor-pointer' />
            </button>
          </li>
        ))}
        {files.length === 0 && !loading && (
          <li className="text-sm text-gray-500">No files uploaded.</li>
        )}
      </ul>
    </div>
  )
}
