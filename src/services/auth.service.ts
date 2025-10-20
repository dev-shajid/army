// auth.server.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/supabase/server'
import { AUTH_REDIRECT_URL, DEFAULT_REDIRECT_URL } from '@/route';
import { cookies } from 'next/headers';
import z from 'zod';
import { SignupSchema } from '@/components/signup-form';

export async function login(data: { email: string; password: string }) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })
  if (error) {
    throw error
  }

  return null
}

export async function signup(data: z.infer<typeof SignupSchema>, redirectUrl: string) {
  const supabase = await createClient()
  // we include the `name` in user_metadata

  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data,
      emailRedirectTo: redirectUrl
    },
  })

  if (error) {
    throw error
  }

  // Optionally: You can redirect to a “check your email” page
  // rather than logging in immediately.
  return authData
}


export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }

  return null
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    throw error
  }
  return data.user
}


export async function resetPassword(email: string, redirectTo: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  })
  if (error) {
    throw error
  }
  return null
}

export async function updatePassword(password: string) {
  const supabase = await createClient()
  const { error, data } = await supabase.auth.updateUser({ password })
  console.log({data, error})
  
  if (error) {
    throw error
  }
  return null
}