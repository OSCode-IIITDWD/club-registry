'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { CLUBS } from '@/lib/utils/clubs'

type ActionState = { error?: string } | undefined

export async function addMembership(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const club = formData.get('club') as string
  const role = ((formData.get('role') as string) ?? '').trim()
  const from = Number(formData.get('from'))
  const current = formData.get('current') === 'on'
  const to = current ? null : Number(formData.get('to'))

  if (!CLUBS.includes(club)) return { error: 'Please select a valid club.' }
  if (!role) return { error: 'Please enter your role.' }
  if (!Number.isInteger(from)) return { error: 'Please enter a valid start year.' }
  if (!current && (!Number.isInteger(to) || (to as number) < from)) {
    return { error: 'End year must be a valid year on or after the start year.' }
  }

  const { error } = await supabase.from('committee_memberships').insert({
    user: user.id,
    club,
    role,
    from,
    to,
  })

  if (error) {
    if (error.code === '23505') return { error: 'You have already added this club.' }
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function removeMembership(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  await supabase
    .from('committee_memberships')
    .delete()
    .eq('id', id)
    .eq('user', user.id)

  revalidatePath('/dashboard')
}
