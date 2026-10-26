'use client'

import { useState, useTransition, useRef, KeyboardEvent } from 'react'
import { saveClubs } from '@/app/actions/clubs'

const DEFAULT_CLUBS = [
  'Coding Club',
  'Cultural Club',
  'Sports Club',
  'NSS',
  'Literary Club',
  'Photography Club',
  'Music Club',
  'Drama Club',
  'Robotics Club',
  'Entrepreneurship Cell',
  'IEEE Student Branch',
  'ACM Student Chapter',
]

interface Membership {
  clubs: string[] | null
  role: string | null
  from: number | null
  to: number | null
}

export default function ClubsForm({ membership }: { membership: Membership | null }) {
  const [selectedClubs, setSelectedClubs] = useState<string[]>(membership?.clubs ?? [])
  const [customInput, setCustomInput] = useState('')
  const [role, setRole] = useState(membership?.role ?? '')
  const [from, setFrom] = useState<string>(membership?.from?.toString() ?? '')
  const [to, setTo] = useState<string>(membership?.to?.toString() ?? '')
  const [error, setError] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function toggleClub(club: string) {
    setSelectedClubs((prev) =>
      prev.includes(club) ? prev.filter((c) => c !== club) : [...prev, club]
    )
  }

  function addCustomClub() {
    const trimmed = customInput.trim()
    if (trimmed && !selectedClubs.includes(trimmed)) {
      setSelectedClubs((prev) => [...prev, trimmed])
    }
    setCustomInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCustomClub()
    }
  }

  function removeClub(club: string) {
    setSelectedClubs((prev) => prev.filter((c) => c !== club))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await saveClubs({
        clubs: selectedClubs,
        role,
        from: Number(from),
        to: Number(to),
      })
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selected clubs */}
      <div>
        <p className="text-sm font-medium text-neutral-700 mb-2">Selected Clubs</p>
        {selectedClubs.length === 0 ? (
          <p className="text-sm text-neutral-400">None selected</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedClubs.map((club) => (
              <span
                key={club}
                className="flex items-center gap-1 px-2.5 py-0.5 bg-neutral-900 text-white text-xs rounded-full"
              >
                {club}
                <button
                  type="button"
                  onClick={() => removeClub(club)}
                  className="ml-0.5 text-neutral-400 hover:text-white transition-colors"
                  aria-label={`Remove ${club}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Default clubs toggles */}
      <div>
        <p className="text-sm font-medium text-neutral-700 mb-2">Select from list</p>
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_CLUBS.map((club) => {
            const active = selectedClubs.includes(club)
            return (
              <button
                key={club}
                type="button"
                onClick={() => toggleClub(club)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                  active
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {club}
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom club input */}
      <div>
        <label htmlFor="custom-club" className="block text-sm font-medium text-neutral-700 mb-1">
          Add a custom club
        </label>
        <div className="flex gap-2">
          <input
            id="custom-club"
            ref={inputRef}
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a club name and press Enter"
            className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
          />
          <button
            type="button"
            onClick={addCustomClub}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:border-neutral-400 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-1">
          Role
        </label>
        <input
          id="role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Core Team, President, Member"
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
        />
      </div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-neutral-700 mb-1">
            From (year)
          </label>
          <input
            id="from"
            type="number"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="2023"
            min={2018}
            max={2035}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
          />
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-neutral-700 mb-1">
            To (year)
          </label>
          <input
            id="to"
            type="number"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="2024"
            min={2018}
            max={2035}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Save Memberships'}
      </button>
    </form>
  )
}
