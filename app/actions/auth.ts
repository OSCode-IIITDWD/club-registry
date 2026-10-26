'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

type LoginState =
  | { step: 'otp'; email: string; error?: string }
  | { step?: never; error?: string; success?: boolean }
  | undefined

type OtpState =
  | { error?: string }
  | undefined

// Email must match: 26bcs001@iiitdwd.ac.in
// Pattern: {2-digit-year}b{branch-code}{roll-digits}@iiitdwd.ac.in
// Branch codes: cs (CSE), ds/da (DSAI), ec (ECE), ai (AIC)
const EMAIL_REGEX = /^[0-9]{2}b(cs|ds|da|ec|ai)[0-9]+@iiitdwd\.ac\.in$/i

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const local = (formData.get('emailLocal') as string).trim().toLowerCase()
  const email = `${local}@iiitdwd.ac.in`

  if (!EMAIL_REGEX.test(email)) {
    return { error: 'A college email ID is needed for this. (e.g. 26bcs001@iiitdwd.ac.in)' }
  }

  const headerStore = await headers()
  const origin = headerStore.get('origin') ?? ''

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: true,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Move to OTP entry step
  return { step: 'otp', email }
}

export async function verifyOtp(_prevState: OtpState, formData: FormData): Promise<OtpState> {
  const email = formData.get('email') as string
  const token = (formData.get('token') as string).trim()

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return { error: 'Invalid or expired code. Please try again.' }
  }

  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
