import Link from 'next/link';
import Image from "next/image";

type NavbarProps = {
    user: {
      id: string
      email?: string
    } | null
  }

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="bg-white shadow flex justify-between items-center px-8 py-4 h-72px">
        <div className="font-fg-xwide text-xl text-gray-800">
            <Link href='/'>
                <Image 
                    className="dark:invert"
                    src="/Grayola-Logo-SVG.svg"
                    alt="Vercel logomark"
                    width={150}
                    height={150}
                />
            </Link>
        </div>
        <nav className="space-x-6 flex justify-center content-center flex-row h-10 gap-5">
            {user ? (
                <Link href="/dashboard" className='grayola-button'>Go to Dashboard</Link>
                ) : (
                    <>
                    <Link href='/login' className='content-center'>Log In</Link>
                    <Link href='/register' className='grayola-button'>Sign In</Link>
                    </>
                )
            }
        </nav>
    </header>
  );
}
