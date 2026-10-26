'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionState = { error?: string } | undefined

export async function saveOnboarding(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const full_name = formData.get('full_name') as string
  const roll = formData.get('roll') as string
  const batch = Number(formData.get('batch'))
  const discipline = formData.get('discipline') as string

  if (!roll || !discipline) {
    return { error: 'Roll number and discipline are required.' }
  }

  const { error } = await supabase.from('user_info').insert({
    id: user.id,
    full_name,
    roll,
    batch,
    discipline,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function updateProfile(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const full_name = formData.get('full_name') as string
  const roll = formData.get('roll') as string
  const batch = Number(formData.get('batch'))
  const discipline = formData.get('discipline') as string

  if (!roll || !discipline) {
    return { error: 'Roll number and discipline are required.' }
  }

  const { error } = await supabase
    .from('user_info')
    .update({ full_name, roll, batch, discipline })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}
