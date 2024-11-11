export { default } from "next-auth/middleware"


export const config = {
  matcher: ['/', '/main/:path*', '/dashboard/:path*'],
  // matcher: ['/test'],
}