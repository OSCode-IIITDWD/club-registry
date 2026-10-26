'use client'

import { useActionState } from 'react'
import { saveOnboarding } from '@/app/actions/profile'

type ActionState = { error?: string } | undefined

export default function OnboardingForm() {
  const [state, action, pending] = useActionState(saveOnboarding, undefined as ActionState)

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
          autoFocus
          placeholder="Ravi Kumar"
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-900 outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Continue'}
      </button>
    </form>
  )
}
