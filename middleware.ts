import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('Middleware - Path:', req.nextUrl.pathname, 'Session:', !!session)

  // If user is logged in and tries to access an auth page, redirect to dashboard
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect routes that require authentication
  if (
    !session &&
    (
      req.nextUrl.pathname.startsWith('/mycontent') ||
      req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/baddieupload') ||
      req.nextUrl.pathname.startsWith('/creatordash') ||
      req.nextUrl.pathname.startsWith('/managecontent')
    )
  ) {
    console.log('Middleware - Redirecting to signin from:', req.nextUrl.pathname)
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mycontent/:path*',
    '/baddieupload/:path*',
    '/creatordash/:path*',
    '/managecontent/:path*',
    '/auth/:path*'
  ],
} 