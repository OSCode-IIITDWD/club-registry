import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MAX_CLUBS } from '@/lib/utils/clubs'

export const instant = false

type UserRow = {
  id: string
  full_name: string | null
  roll: string
  batch: number | null
  discipline: string
}

type Membership = {
  id: string
  user: string
  club: string
  role: string | null
  from: number | null
  to: number | null
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'amber' | 'red' }) {
  const styles =
    tone === 'amber'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-red-50 text-red-700 border-red-200'
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium border rounded-full ${styles}`}>
      {children}
    </span>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  )
}

function countBy<T>(items: T[], key: (item: T) => string | number | null) {
  const map = new Map<string | number, number>()
  for (const item of items) {
    const k = key(item) ?? '—'
    map.set(k, (map.get(k) ?? 0) + 1)
  }
  return [...map.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])))
}

export default async function StatsPage() {
  await connection()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: me } = await supabase
    .from('user_info')
    .select('admin')
    .eq('id', user.id)
    .single()

  if (!me?.admin) redirect('/dashboard')

  const [{ data: usersData }, { data: membershipsData }] = await Promise.all([
    supabase.from('user_info').select('id, full_name, roll, batch, discipline').order('roll'),
    supabase.from('committee_memberships').select('id, user, club, role, from, to'),
  ])

  const users: UserRow[] = (usersData ?? []).map((u) => ({
    ...u,
    batch: u.batch == null ? null : Number(u.batch),
  }))
  const memberships: Membership[] = membershipsData ?? []

  // ---- derived data ----
  const userById = new Map(users.map((u) => [u.id, u]))

  const membershipsByUser = new Map<string, Membership[]>()
  for (const m of memberships) {
    const list = membershipsByUser.get(m.user) ?? []
    list.push(m)
    membershipsByUser.set(m.user, list)
  }
  const clubCount = (userId: string) => membershipsByUser.get(userId)?.length ?? 0

  const clubNames = [...new Set(memberships.map((m) => m.club))].sort()

  const clubs = clubNames.map((name) => {
    const rows = memberships
      .filter((m) => m.club === name)
      .map((m) => ({ m, u: userById.get(m.user) }))
      .sort(
        (a, b) =>
          (a.u?.batch ?? 0) - (b.u?.batch ?? 0) ||
          (a.u?.roll ?? '').localeCompare(b.u?.roll ?? ''),
      )
    const batches = countBy(rows, (r) => r.u?.batch ?? null)
    const disciplines = countBy(rows, (r) => r.u?.discipline ?? null)
    const current = rows.filter((r) => r.m.to == null).length
    return { name, rows, batches, disciplines, current }
  })
  clubs.sort((a, b) => b.rows.length - a.rows.length || a.name.localeCompare(b.name))

  const usersInAnyClub = users.filter((u) => clubCount(u.id) >= 1).length
  const usersInMultiple = users.filter((u) => clubCount(u.id) > 1).length
  const usersOverLimit = users.filter((u) => clubCount(u.id) > MAX_CLUBS).length

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase">IIIT Dharwad</p>
            <h1 className="text-base font-semibold text-neutral-900">Club Registry · Stats</h1>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Overview */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Registered users" value={users.length} />
          <StatCard label="Users in a club" value={usersInAnyClub} />
          <StatCard label="Total memberships" value={memberships.length} />
          <StatCard label="In more than 1 club" value={usersInMultiple} />
          <StatCard label={`In more than ${MAX_CLUBS} clubs`} value={usersOverLimit} />
        </section>

        {/* Clubs */}
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-3">Clubs</h2>
          {clubs.length === 0 ? (
            <p className="text-sm text-neutral-400">No memberships recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {clubs.map((club) => {
                const maxBatch = Math.max(...club.batches.map(([, n]) => n))
                return (
                  <details
                    key={club.name}
                    className="group bg-white border border-neutral-200 rounded-xl shadow-sm"
                  >
                    <summary className="cursor-pointer list-none p-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="text-neutral-400 text-xs transition-transform group-open:rotate-90">▶</span>
                      <span className="text-sm font-semibold text-neutral-900">{club.name}</span>
                      <span className="text-sm text-neutral-600">
                        {club.rows.length} member{club.rows.length === 1 ? '' : 's'}
                      </span>
                      <span className="text-xs text-neutral-400">{club.current} current</span>
                      <span className="flex flex-wrap gap-1.5 sm:ml-auto">
                        {club.batches.map(([batch, n]) => (
                          <span
                            key={batch}
                            className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full"
                          >
                            {batch}: {n}
                          </span>
                        ))}
                      </span>
                    </summary>

                    <div className="border-t border-neutral-100 p-4 space-y-5">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Batch distribution */}
                        <div>
                          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                            Batch distribution
                          </p>
                          <div className="space-y-1.5">
                            {club.batches.map(([batch, n]) => (
                              <div key={batch} className="flex items-center gap-2 text-xs">
                                <span className="w-10 text-neutral-500">{batch}</span>
                                <div className="flex-1 bg-neutral-100 rounded h-2">
                                  <div
                                    className="bg-neutral-800 h-2 rounded"
                                    style={{ width: `${(n / maxBatch) * 100}%` }}
                                  />
                                </div>
                                <span className="w-6 text-right text-neutral-700">{n}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Discipline distribution */}
                        <div>
                          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                            Discipline distribution
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {club.disciplines.map(([d, n]) => (
                              <span
                                key={d}
                                className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                              >
                                {d}: {n}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Member list */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-neutral-400 border-b border-neutral-100">
                              <th className="py-2 pr-4 font-medium">Name</th>
                              <th className="py-2 pr-4 font-medium">Roll</th>
                              <th className="py-2 pr-4 font-medium">Batch</th>
                              <th className="py-2 pr-4 font-medium">Discipline</th>
                              <th className="py-2 pr-4 font-medium">Role</th>
                              <th className="py-2 font-medium">Period</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-50">
                            {club.rows.map(({ m, u }) => {
                              const n = clubCount(m.user)
                              return (
                                <tr key={m.id} className="text-neutral-700">
                                  <td className="py-2 pr-4">
                                    <span className="mr-2">{u?.full_name || '—'}</span>
                                    {n > MAX_CLUBS && <Badge tone="red">{n} clubs</Badge>}
                                  </td>
                                  <td className="py-2 pr-4 uppercase">{u?.roll ?? '—'}</td>
                                  <td className="py-2 pr-4">{u?.batch ?? '—'}</td>
                                  <td className="py-2 pr-4">{u?.discipline ?? '—'}</td>
                                  <td className="py-2 pr-4">{m.role || '—'}</td>
                                  <td className="py-2 whitespace-nowrap">
                                    {m.from ?? '—'} – {m.to ?? 'Present'}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                )
              })}
            </div>
          )}
        </section>

        {/* Users */}
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-3">Users and their clubs</h2>
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-neutral-400 border-b border-neutral-100">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Roll</th>
                  <th className="p-3 font-medium">Batch</th>
                  <th className="p-3 font-medium">Discipline</th>
                  <th className="p-3 font-medium">Clubs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {users.map((u) => {
                  const list = membershipsByUser.get(u.id) ?? []
                  return (
                    <tr key={u.id} className="text-neutral-700 align-top">
                      <td className="p-3">
                        <span className="mr-2">{u.full_name || '—'}</span>
                        {list.length > 1 && <Badge tone="amber">{list.length} clubs</Badge>}
                      </td>
                      <td className="p-3 uppercase">{u.roll}</td>
                      <td className="p-3">{u.batch ?? '—'}</td>
                      <td className="p-3">{u.discipline}</td>
                      <td className="p-3">
                        {list.length === 0 ? (
                          <span className="text-neutral-300">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {list.map((m) => (
                              <span
                                key={m.id}
                                title={`${m.from ?? '—'} – ${m.to ?? 'Present'}`}
                                className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                              >
                                {m.club}
                                {m.role ? ` · ${m.role}` : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
