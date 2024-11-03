import AuthProvider from '../context/auth-provider'
import Header from '../components/header';
import MenuBottom from '../components/menu-bottom'

import "../globals.css"


export const metadata = {
  title: "Pegasus - Unifiber",
  description: "Created by Leonard Sianipar",
};




export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-quicksand">
        <AuthProvider>
          <Header user={'Dankom'} />
            {children}
          <footer className='fixed bottom-0 w-full z-[999]'><MenuBottom /></footer>
        </AuthProvider>

      </body>
    </html>
  )
}
