import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ClubsForm from './clubs-form'

export const instant = false

export default async function ClubsPage() {
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

  const { data: membership } = await supabase
    .from('committee_memberships')
    .select('*')
    .eq('user', user.id)
    .single()

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-neutral-900">Club Memberships</h1>
          <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <ClubsForm membership={membership} />
        </div>
      </main>
    </div>
  )
}
