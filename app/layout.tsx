import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'IIIT Dharwad Club Registry',
  description: 'Track and manage club memberships at IIIT Dharwad',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      style={{ colorScheme: 'light' }}
      className={`${geist.variable} h-full`}
    >
      <body className="min-h-full bg-white text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  )
}
