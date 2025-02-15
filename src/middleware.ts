  import { NextResponse } from 'next/server'
  import type { NextRequest } from 'next/server'

  const publicRoutes = ['/login', '/register']

  export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
  
    const token = request.cookies.get('jwt')?.value
  
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const isPublicRoute = publicRoutes.includes(pathname)

    if (isPublicRoute && token) {
      return NextResponse.redirect(new URL('/chat', request.url))
    }

    if (!isPublicRoute && !token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  export const config = {
    matcher: [
      '/',
      '/chat/:path*',
      '/profile/:path*',
      '/settings/:path*',
      '/login',
      '/register'
    ]
  }
