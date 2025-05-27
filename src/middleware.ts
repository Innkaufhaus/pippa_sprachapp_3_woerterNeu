import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from './utils/logger'

export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID()
  logger.info(`[${requestId}] Request started: ${request.method} ${request.url}`)

  const response = NextResponse.next()
  response.headers.set('x-request-id', requestId)

  // Log the request completion
  logger.info(`[${requestId}] Request processed: ${request.method} ${request.url}`)

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
