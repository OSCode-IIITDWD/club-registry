import { connection } from 'next/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import { removeMembership } from '@/app/actions/clubs'
import { MAX_CLUBS } from '@/lib/utils/clubs'

export const instant = false

export default async function DashboardPage() {
  await connection()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userInfo } = await supabase
    .from('user_info')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!userInfo) {
    redirect('/onboarding')
  }

  const { data: memberships } = await supabase
    .from('committee_memberships')
    .select('*')
    .eq('user', user.id)
    .order('from', { ascending: false })

  const overLimit = (memberships?.length ?? 0) > MAX_CLUBS

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase">IIIT Dharwad</p>
            <h1 className="text-base font-semibold text-neutral-900">Club Registry</h1>
          </div>
          <div className="flex items-center gap-4">
            {userInfo.admin && (
              <Link
                href="/stats"
                className="text-sm text-neutral-500 hover:text-neutral-900 border border-neutral-200 rounded-lg px-3 py-1.5 transition-colors"
              >
                View stats
              </Link>
            )}
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {overLimit && (
          <div
            role="alert"
            className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3"
          >
            <p className="font-medium">Club limit exceeded</p>
            <p className="mt-0.5">
              Up to {MAX_CLUBS} clubs are allowed. You currently have {memberships!.length}.
              Please remove {memberships!.length - MAX_CLUBS} to stay within the limit.
            </p>
          </div>
        )}

        {/* Profile card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                {userInfo.full_name || 'No name set'}
              </h2>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
            <Link
              href="/profile"
              className="text-sm text-neutral-500 hover:text-neutral-900 border border-neutral-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Roll No.</p>
              <p className="text-sm font-medium text-neutral-800">{userInfo.roll}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Discipline</p>
              <p className="text-sm font-medium text-neutral-800">{userInfo.discipline}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Batch</p>
              <p className="text-sm font-medium text-neutral-800">{userInfo.batch ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Club memberships card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-neutral-900">Club Memberships</h2>
            <Link
              href="/clubs"
              className="text-sm text-neutral-500 hover:text-neutral-900 border border-neutral-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              Add club
            </Link>
          </div>

          {!memberships || memberships.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No memberships recorded yet.{' '}
              <Link href="/clubs" className="text-neutral-600 underline underline-offset-2">
                Add your first club
              </Link>
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {memberships.map((m) => (
                <li key={m.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{m.club}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {m.role || '—'} · {m.from ?? '—'} – {m.to ?? 'Present'}
                    </p>
                  </div>
                  <form action={removeMembership}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      className="text-xs text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
