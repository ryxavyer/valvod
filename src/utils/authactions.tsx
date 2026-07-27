'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@src/lib/supabase'
import { Provider, SignInWithOAuthCredentials } from '@supabase/supabase-js'

// Vercel's URL env vars are bare hostnames with no scheme. A `redirectTo` without
// a scheme isn't a valid absolute URL, so Supabase silently discards it and falls
// back to the project's Site URL -- which lands the user on a page that never
// exchanges the code.
const withProtocol = (url: string) => {
  const trimmed = url.trim().replace(/\/+$/, '')
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `${trimmed.startsWith('localhost') ? 'http' : 'https'}://${trimmed}`
}

const getURL = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return withProtocol(process.env.NEXT_PUBLIC_SITE_URL)
  }

  // Derive from the request so previews, custom domains and localhost all work.
  const headerList = headers()
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host')
  if (host) {
    const proto = headerList.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
    return `${proto}://${host}`
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  return vercelHost ? withProtocol(vercelHost) : 'http://localhost:3000'
}

export async function login(formData: FormData): Promise<{success: boolean, message?: string}> {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true }
}

export async function signup(formData: FormData): Promise<{success: boolean, message?: string}> {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signUp(data)
  if (error) {
    return {success: false, message: error.message}
  }
  return { success: true, message: "Account created! Check your email for verification." }
}

export async function oauth(formData: FormData) {
  const authdata: SignInWithOAuthCredentials = {
    provider: formData.get('provider') as Provider,
    options: { redirectTo: `${getURL()}/auth/callback` }
  }
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth(authdata)
  if (error) {
    throw error
  }
  if (data.url) {
    redirect(data.url)
  }
}

export async function sendResetPasswordEmail(formData: FormData): Promise<{ success: boolean, message?: string }> {
  const supabase = await createClient()
  const email = formData.get('email') as string
  // Route through the callback: only a Route Handler can persist the session
  // cookies from the code exchange, so the reset page can't do it itself.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}/auth/callback?next=${encodeURIComponent('/auth/reset-password')}`
  })
  if (error) {
    console.error('[sendResetPasswordEmail] Error:', error.message)
    return { success: false, message: error.message }
  }
  return { success: true }
}

export async function resetPassword(formData: FormData): Promise<{ success: boolean, message?: string }> {
  console.log('[resetPassword] Starting password reset...')

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('[resetPassword] Error getting user:', userError.message)
    return { success: false, message: userError.message }
  }

  if (!user) {
    console.error('[resetPassword] No user found in session')
    return { success: false, message: 'Session expired. Please request a new password reset link.' }
  }

  console.log('[resetPassword] User found:', user.email)

  const { error } = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  })

  if (error) {
    console.error('[resetPassword] Error updating password:', error.message)
    return { success: false, message: error.message }
  }

  console.log('[resetPassword] Password updated successfully, signing out...')
  await supabase.auth.signOut()

  console.log('[resetPassword] Sign out complete')
  return { success: true }
}
