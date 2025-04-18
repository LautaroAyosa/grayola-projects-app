import '@/app/globals.css'
import Image from 'next/image'

export default function CompleteProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white min-h-screen">
      <main className="flex flex-col lg:flex-row-reverse min-h-screen w-full">
        

        {/* Visual section (right, fills remaining space) */}
        <div className="flex-1 bg-gradient-to-br from-brand to-green-200 relative h-40 lg:h-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/grayola-illustration.svg"
              alt="Grayola"
              className="w-2/3 max-w-sm lg:max-w-md object-contain"
              width={400}
              height={400}
            />
          </div>
        </div>
        {/* Form section (left, fixed width) */}
        <div className="w-full lg:w-[580px] bg-white flex flex-col justify-center px-6 sm:px-10 py-12 sm:py-16 shadow-lg z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
