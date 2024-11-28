'use client'
import AuthProvider from '../context/auth-provider'
import Header from '../components/header';
import MenuBottom from '../components/menu-bottom'

import "../globals.css"
import { useSession } from 'next-auth/react';





export default function RootLayout({ children }) {
  const { data: session, status} = useSession()

  return (
    <html lang="en">
      <body className="antialiased font-quicksand">
        <AuthProvider>
          <Header user={session?.user.name} />
            {children}
          <footer className='fixed bottom-0 w-full z-[999] sm:hidden'>
            <MenuBottom />
            <div className='absolute bottom-10 right-4 flex justify-center items-center w-6 h-6 p-1 rounded-full text-white bg-amtred animate-bounce'>
              <span>1</span>
            </div>
          </footer>
        </AuthProvider>

      </body>
    </html>
  )
}
