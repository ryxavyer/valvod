import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@src/lib/supabase'

// Only same-origin relative paths, so `next` can't be turned into an open redirect.
function safeNext(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/'
  return next
}

// request.url is the internal URL behind Vercel's proxy, so prefer the forwarded host.
function siteOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  if (forwardedHost) {
    const proto = request.headers.get('x-forwarded-proto') ?? 'https'
    return `${proto}://${forwardedHost}`
  }
  return new URL(request.url).origin
}

function errorRedirect(origin: string, reason: string) {
  return NextResponse.redirect(`${origin}/auth/auth-code-error?reason=${encodeURIComponent(reason)}`)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const origin = siteOrigin(request)
  const next = safeNext(searchParams.get('next'))

  // The provider can bounce back with a denial instead of a code.
  const providerError = searchParams.get('error_description') ?? searchParams.get('error')
  if (providerError) {
    return errorRedirect(origin, providerError.replace(/\+/g, ' '))
  }

  const code = searchParams.get('code')
  if (!code) {
    return errorRedirect(origin, 'No authorization code was returned by the provider.')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    // A replayed code (back button, refresh) fails even though the user is
    // already signed in -- send them on rather than showing a scary error.
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    return errorRedirect(origin, error.message)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
