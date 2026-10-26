'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/app/actions/profile'

type ActionState = { error?: string } | undefined

const DISCIPLINES = ['CSE', 'DSAI', 'ECE', 'CSAI']

interface UserInfo {
  full_name: string | null
  roll: string
  batch: number | null
  discipline: string
}

export default function ProfileForm({ userInfo }: { userInfo: UserInfo }) {
  const [state, action, pending] = useActionState(updateProfile, undefined as ActionState)

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-neutral-700 mb-1">
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={userInfo.full_name ?? ''}
          placeholder="Ravi Kumar"
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
        />
      </div>

      <div>
        <label htmlFor="roll" className="block text-sm font-medium text-neutral-700 mb-1">
          Roll Number <span className="text-red-500">*</span>
        </label>
        <input
          id="roll"
          name="roll"
          type="text"
          required
          defaultValue={userInfo.roll}
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="batch" className="block text-sm font-medium text-neutral-700 mb-1">
          Batch Year
        </label>
        <input
          id="batch"
          name="batch"
          type="number"
          min={2018}
          max={2030}
          defaultValue={userInfo.batch ?? ''}
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="discipline" className="block text-sm font-medium text-neutral-700 mb-1">
          Discipline <span className="text-red-500">*</span>
        </label>
        <select
          id="discipline"
          name="discipline"
          required
          defaultValue={userInfo.discipline}
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors bg-white text-neutral-900"
        >
          {DISCIPLINES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}
