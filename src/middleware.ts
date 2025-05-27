import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Remove all matchers to disable edge runtime
export const config = {
  matcher: []
}
