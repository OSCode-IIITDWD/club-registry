'use client'

import { useState, useActionState } from 'react'
import { addMembership } from '@/app/actions/clubs'

type ActionState = { error?: string } | undefined

const input =
  'w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-900 outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300'
const label = 'block text-sm font-medium text-neutral-700 mb-1'

export default function ClubsForm({ clubs }: { clubs: string[] }) {
  const [state, action, pending] = useActionState(addMembership, undefined as ActionState)
  const [current, setCurrent] = useState(true) // checked by default

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="club" className={label}>Club</label>
        <select id="club" name="club" required defaultValue="" className={`${input} bg-white`}>
          <option value="" disabled>Select a club</option>
          {clubs.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="role" className={label}>Role</label>
        <input id="role" name="role" type="text" required placeholder="Member, Secretary…" className={input} />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
        <input
          type="checkbox"
          name="current"
          checked={current}
          onChange={(e) => setCurrent(e.target.checked)}
          className="rounded border-neutral-300"
        />
        I'm currently a member
      </label>

      <div className={`grid gap-4 ${current ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div>
          <label htmlFor="from" className={label}>From (year)</label>
          <input
            id="from"
            name="from"
            type="number"
            required
            min={2018}
            max={2100}
            placeholder="2024"
            className={input}
          />
        </div>

        {!current && (
          <div>
            <label htmlFor="to" className={label}>To (year)</label>
            <input
              id="to"
              name="to"
              type="number"
              required
              min={2018}
              max={2100}
              placeholder="2025"
              className={input}
            />
          </div>
        )}
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {pending ? 'Adding…' : 'Add club'}
      </button>
    </form>
  )
}
