import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from '@/utils/logger'

export function middleware(request: NextRequest) {
  logger.info(`[${request.headers.get('x-request-id')}] Request started: ${request.method} ${request.url}`)
  const response = NextResponse.next()
  logger.info(`[${request.headers.get('x-request-id')}] Request processed: ${request.method} ${request.url}`)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
