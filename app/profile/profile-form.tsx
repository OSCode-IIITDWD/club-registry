'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/app/actions/profile'

type ActionState = { error?: string } | undefined

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
          required
          defaultValue={userInfo.full_name ?? ''}
          placeholder="Ravi Kumar"
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-900 outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
        <div>
          <p className="text-xs text-neutral-400 mb-0.5">Roll No.</p>
          <p className="text-sm font-medium text-neutral-800">{userInfo.roll.toUpperCase()}</p>
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
      <p className="text-xs text-neutral-400">
        Roll number, discipline, and batch are derived from your college email and can't be edited.
      </p>

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
