
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl
  
  // Get JWT from cookies
  const token = request.cookies.get('jwt')?.value
  
  // Check if the path is public
  const isPublicRoute = publicRoutes.includes(pathname)

  // Redirect authenticated users away from public routes (like login)
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  // Redirect unauthenticated users to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/chat/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register'
  ]
}
