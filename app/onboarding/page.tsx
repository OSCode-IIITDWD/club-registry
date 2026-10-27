import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OnboardingForm from './onboarding-form'

export const instant = false

export default async function OnboardingPage() {
  await connection()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // If already onboarded, go to dashboard
  const { data: existing } = await supabase
    .from('user_info')
    .select('id')
    .eq('id', user.id)
    .single()

  if (existing) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-neutral-900">Complete your profile</h1>
          <p className="mt-1 text-sm text-neutral-500">
            This is required before you can use the registry.
          </p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">
          <OnboardingForm />
        </div>
      </div>
    </div>
  )
}
