'use client'

import { useActionState, useState } from 'react'
import { login, signup } from '@/app/actions/auth'

type ActionState = { error?: string } | undefined

const initialState: ActionState = undefined

export default function LoginPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [loginState, loginAction, loginPending] = useActionState(login, initialState)
  const [signupState, signupAction, signupPending] = useActionState(signup, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase mb-1">
            Indian Institute of Information Technology
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900">Dharwad</h1>
          <p className="mt-1 text-sm text-neutral-500">Club Registry</p>
        </div>

        {/* Card */}
        <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">
          {/* Tabs */}
          <div className="flex border border-neutral-200 rounded-lg p-0.5 mb-6">
            <button
              onClick={() => setTab('signin')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === 'signin'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === 'signup'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {tab === 'signin' && (
            <form action={loginAction} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@iiitdwd.ac.in"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
                />
              </div>
              {loginState?.error && (
                <p className="text-sm text-red-600">{loginState.error}</p>
              )}
              <button
                type="submit"
                disabled={loginPending}
                className="w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                {loginPending ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {tab === 'signup' && (
            <form action={signupAction} className="space-y-4">
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@iiitdwd.ac.in"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
                />
                <p className="mt-1 text-xs text-neutral-400">Only @iiitdwd.ac.in addresses allowed</p>
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-300"
                />
              </div>
              {signupState?.error && (
                <p className="text-sm text-red-600">{signupState.error}</p>
              )}
              <button
                type="submit"
                disabled={signupPending}
                className="w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                {signupPending ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
