'use client'
import Header from '../components/header';
import MenuBottom from '../components/menu-bottom'

import { useSession } from 'next-auth/react';

import "../globals.css"
import { SessionProvider } from '../context/session-provider';




export default function RootLayout({ children }) {
  const { data: session, status} = useSession()
  
  return (
    <SessionProvider session={session}>
      <Header user={session?.user?.name} />
      {children}
      <footer className="fixed bottom-0 w-full z-[999] sm:hidden">
        <MenuBottom />
      </footer>
    </SessionProvider>
  )
}
