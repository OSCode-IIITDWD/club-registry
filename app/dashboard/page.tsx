import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'

export default async function DashboardPage() {
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

  const { data: membership } = await supabase
    .from('committee_memberships')
    .select('*')
    .eq('user', user.id)
    .single()

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase">IIIT Dharwad</p>
            <h1 className="text-base font-semibold text-neutral-900">Club Registry</h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
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
              {membership ? 'Edit' : 'Add'}
            </Link>
          </div>

          {!membership ? (
            <p className="text-sm text-neutral-400">
              No memberships recorded yet.{' '}
              <Link href="/clubs" className="text-neutral-600 underline underline-offset-2">
                Add your clubs
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {/* Clubs */}
              {membership.clubs && membership.clubs.length > 0 && (
                <div>
                  <p className="text-xs text-neutral-400 mb-2">Clubs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {membership.clubs.map((club: string) => (
                      <span
                        key={club}
                        className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                      >
                        {club}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Role / Years */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-neutral-100">
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">Role</p>
                  <p className="text-sm font-medium text-neutral-800">{membership.role || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">From</p>
                  <p className="text-sm font-medium text-neutral-800">{membership.from ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">To</p>
                  <p className="text-sm font-medium text-neutral-800">{membership.to ?? '—'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
