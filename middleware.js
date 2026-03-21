import { NextResponse } from 'next/server'

export function middleware(req) {
  const host = req.headers.get('host') || ''
  let site = 'nspdm'

  if (host.includes('nspdmap')) {
    site = 'nspdmap'
  }

  if (host.includes('nspdmaps')) {
    site = 'nspdmaps'
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-site', site)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}