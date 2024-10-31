'use client'

import { SessionProvider } from 'next-auth/react'

// import { ExpiredSession } from './expired-session'

const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default AuthProvider