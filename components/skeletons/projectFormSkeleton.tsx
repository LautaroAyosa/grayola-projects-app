// components/skeletons/ProjectFormSkeleton.tsx
export default function ProjectFormSkeleton() {
    return (
      <div className="max-w-3xl mx-auto mt-10 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-6" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-32 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    )
  }
  