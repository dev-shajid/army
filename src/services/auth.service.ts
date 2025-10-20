// auth.server.ts
'use server'

import { createClient } from '@/supabase/server'
import { AUTH_REDIRECT_URL } from '@/route';
import z from 'zod';
import { SignupSchema } from '@/components/signup-form';
import { AuthError, User } from '@supabase/supabase-js';


interface Response<T> {
  success: boolean;
  data?: T;
  error?: string
}

export async function login(data: { email: string; password: string }): Promise<Response<null>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function signup(data: z.infer<typeof SignupSchema>): Promise<Response<null>> {
  const supabase = await createClient()
  // we include the `name` in user_metadata
  const redirectUrl = `${new URL(AUTH_REDIRECT_URL, process.env.NEXT_PUBLIC_BASE_URL).toString()}`

  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data,
      emailRedirectTo: redirectUrl
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Optionally: You can redirect to a “check your email” page
  // rather than logging in immediately.
  return { success: true}
}


export async function logout() : Promise<Response<null>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}


export async function getCurrentUser(): Promise<Response<User>> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true, data: data.user }
}


export async function resetPassword(email: string) : Promise<Response<null>> {
  const supabase = await createClient()
  const redirectTo = `${new URL('reset-password', process.env.NEXT_PUBLIC_BASE_URL).toString()}`
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  })
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}