import AuthProvider from './context/auth-provider'
import "./globals.css"

export const metadata = {
  title: "Pegasus - Unifiber",
  description: "Created by Leonard Sianipar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
