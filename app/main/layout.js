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
          <footer className='fixed bottom-0 w-full z-[999] sm:hidden'><MenuBottom /></footer>
        </AuthProvider>

      </body>
    </html>
  )
}
