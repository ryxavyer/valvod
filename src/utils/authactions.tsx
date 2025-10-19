'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@src/lib/supabase'
import { Provider, SignInWithOAuthCredentials } from '@supabase/supabase-js'

const getURL = () => {
  let url =
    process.env.VERCEL_URL ??
    'http://localhost:3000'
  return url
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
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}/auth/reset-password`
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
