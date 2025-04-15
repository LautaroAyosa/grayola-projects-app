'use client'

import { Button } from '@/components/ui/button'

type ConfirmModalProps = {
  title?: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

export default function ConfirmModal({
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex justify-start gap-3">
          <Button variant="outline" onClick={onCancel} className='cursor-pointer'>{cancelLabel}</Button>
          <Button
            variant={danger ? 'destructive' : 'default'}
            onClick={onConfirm}
            className='cursor-pointer'
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
