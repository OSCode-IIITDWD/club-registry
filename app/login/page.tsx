'use client'

import { useActionState, useState } from 'react'
import { login, verifyOtp } from '@/app/actions/auth'

type LoginState =
  | { step: 'otp'; email: string; error?: string }
  | { step?: never; error?: string }
  | undefined

type OtpState = { error?: string } | undefined

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState(login, undefined as LoginState)
  const [otpState, otpAction, otpPending] = useActionState(verifyOtp, undefined as OtpState)
  const [manualEmail, setManualEmail] = useState<string | null>(null)

  // The email we're working with in step 2
  const activeEmail = loginState?.step === 'otp' ? loginState.email : manualEmail

  const isOtpStep = loginState?.step === 'otp'

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase mb-1">
            Indian Institute of Information Technology Dharwad
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900">Technical Committee</h1>
          <p className="mt-1 text-sm text-neutral-500">Club Registry</p>
        </div>

        <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">

          {!isOtpStep ? (
            /* ── Step 1: Email input ── */
            <form action={loginAction} className="space-y-4">
              <div>
                <label
                  htmlFor="emailLocal"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  College Email
                </label>
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden focus-within:border-neutral-400 transition-colors">
                  <input
                    id="emailLocal"
                    name="emailLocal"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="24BDS051"
                    className="flex-1 px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-300 bg-white min-w-0"
                  />
                  <span className="px-3 py-2 text-sm text-neutral-400 bg-neutral-50 border-l border-neutral-200 whitespace-nowrap select-none">
                    @iiitdwd.ac.in
                  </span>
                </div>
              </div>

              {loginState?.error && (
                <p className="text-sm text-red-600">{loginState.error}</p>
              )}

              <button
                type="submit"
                disabled={loginPending}
                className="w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                {loginPending ? 'Sending…' : 'Send Code'}
              </button>
            </form>

          ) : (
            /* ── Step 2: OTP + magic link info ── */
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-neutral-800">Check your email</p>
                <p className="text-xs text-neutral-500 break-all">{activeEmail}</p>
              </div>

              {/* OTP entry */}
              <form action={otpAction} className="space-y-4">
                <input type="hidden" name="email" value={activeEmail ?? ''} />
                <div>
                  <label
                    htmlFor="token"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Enter 6-digit code
                  </label>
                  <input
                    id="token"
                    name="token"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                    placeholder="123456"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-900 outline-none focus:border-neutral-400 transition-colors tracking-widest placeholder:text-neutral-300 placeholder:tracking-normal text-center"
                  />
                </div>

                {otpState?.error && (
                  <p className="text-sm text-red-600">{otpState.error}</p>
                )}

                <button
                  type="submit"
                  disabled={otpPending}
                  className="w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  {otpPending ? 'Verifying…' : 'Verify Code'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-100" />
                <span className="text-xs text-neutral-400">or</span>
                <div className="flex-1 h-px bg-neutral-100" />
              </div>

              <p className="text-center text-xs text-neutral-500">
                Click the <span className="font-medium text-neutral-700">magic link</span> in your email to sign in directly.
              </p>

              {/* Back */}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full text-xs text-neutral-400 hover:text-neutral-600 transition-colors pt-1"
              >
                ← Use a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
