'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function JoinPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      setError('Please enter a session code')
      return
    }
    if (!/^[A-Z0-9]{4,6}$/.test(trimmed)) {
      setError('Session codes are 5 characters (letters and numbers)')
      return
    }
    router.push(`/join/${trimmed}`)
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🔑</div>
          <h1 className="text-4xl font-black text-white tracking-tight">Join Session</h1>
          <p className="text-gray-500">Enter the code displayed on the host screen</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="code" className="block text-sm font-semibold text-gray-300">
              Session Code
            </label>
            <input
              id="code"
              type="text"
              autoFocus
              autoCapitalize="characters"
              placeholder="e.g. A7K2Q"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
                if (error) setError('')
              }}
              maxLength={6}
              className={[
                'w-full px-4 py-4 rounded-xl bg-gray-800 text-white placeholder-gray-600',
                'font-mono text-2xl font-bold tracking-[0.3em] text-center border transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-violet-500',
                error ? 'border-red-500' : 'border-gray-700 focus:border-violet-500',
              ].join(' ')}
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95
              text-white font-bold text-lg transition-all"
          >
            Join Session
          </button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
