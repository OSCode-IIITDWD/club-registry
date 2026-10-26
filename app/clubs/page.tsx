import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CLUBS } from '@/lib/utils/clubs'
import ClubsForm from './clubs-form'

export const instant = false

export default async function ClubsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existing } = await supabase
    .from('committee_memberships')
    .select('club')
    .eq('user', user.id)

  const taken = new Set((existing ?? []).map((m) => m.club))
  const available = CLUBS.filter((c) => !taken.has(c))

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="max-w-md mx-auto px-4 py-10">
        <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Back
        </Link>
        <h1 className="text-lg font-semibold text-neutral-900 mt-4 mb-6">Add a club</h1>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          {available.length === 0 ? (
            <p className="text-sm text-neutral-500">You've already added every club.</p>
          ) : (
            <ClubsForm clubs={available} />
          )}
        </div>
      </main>
    </div>
  )
}
