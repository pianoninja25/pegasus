import AuthProvider from './context/auth-provider'
import "./globals.css"

export const metadata = {
  title: "Pegasus - Unifiber",
  description: "Created by Leonard Sianipar",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className="antialiased font-quicksand">
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
