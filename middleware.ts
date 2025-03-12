import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

const locales = ['en', 'fi', 'sv']
const defaultLocale = 'fi'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') || ''
  const negotiator = new Negotiator({ headers: { 'accept-language': acceptLanguage } })
  const languages = negotiator.languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('idToken')?.value

  // Authentication check
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Locale handling
  if (
    !locales.some((locale) => 
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    ) && 
    !pathname.startsWith('/_next') &&
    !pathname.includes('/api/') 
  ) {
    const locale = getLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}
