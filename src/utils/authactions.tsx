'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@src/lib/supabase'
import { Provider, SignInWithOAuthCredentials } from '@supabase/supabase-js'

const getURL = () => {
  let url =
    process.env.VERCEL_URL ??
    'http://localhost:3000'
  return url
}

export async function login(formData: FormData): Promise<{success: boolean, message: string}> {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    return { success: false, message: error.message }
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData): Promise<{success: boolean, message: string}> {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signUp(data)
  if (error) {
    return {success: false, message: error.message}
  }
  revalidatePath('/', 'layout')
  redirect('/')
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

export async function sendResetPasswordEmail(formData: FormData): Promise<boolean> {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}/auth/reset-password`
  })
  if (error) {
    return false
  }
  return true
}

export async function resetPassword(formData: FormData): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  })
  if (error) {
    return false
  }
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
