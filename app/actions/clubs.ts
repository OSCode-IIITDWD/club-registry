'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function saveClubs(data: {
  clubs: string[]
  role: string
  from: number
  to: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase.from('committee_memberships').upsert(
    {
      user: user.id,
      clubs: data.clubs,
      role: data.role,
      from: data.from,
      to: data.to,
    },
    { onConflict: 'user' }
  )

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}
