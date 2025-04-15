'use client'

export default function SettingsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <div className="h-5 w-1/4 bg-gray-200 rounded" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mt-4" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mt-4" />
          <div className="h-10 bg-gray-100 rounded" />
        </div>
        <div className="h-10 bg-gray-300 rounded w-32 mt-4" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <div className="h-5 w-1/4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-10 bg-gray-100 rounded" />
      </div>
    </div>
  )
}
