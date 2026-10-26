import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userInfo } = await supabase
    .from('user_info')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!userInfo) {
    redirect('/onboarding')
  }

  redirect('/dashboard')
}
