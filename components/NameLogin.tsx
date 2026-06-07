'use client'

import { useState, useRef } from 'react'

interface NameLoginProps {
  sessionId: string
  onJoin: (name: string) => void
}

export default function NameLogin({ sessionId, onJoin }: NameLoginProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter your name')
      inputRef.current?.focus()
      return
    }
    if (trimmed.length > 40) {
      setError('Name must be 40 characters or less')
      return
    }
    setError('')
    onJoin(trimmed)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="text-5xl">⚡</div>
          <h1 className="text-3xl font-black text-white tracking-tight">Buzzer</h1>
          <p className="text-gray-500 text-sm">
            Joining session{' '}
            <span className="font-mono font-bold text-violet-400">{sessionId}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-300">
              Your Name
            </label>
            <input
              ref={inputRef}
              id="name"
              type="text"
              autoFocus
              autoComplete="nickname"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              maxLength={40}
              className={[
                'w-full px-4 py-3.5 rounded-xl bg-gray-800 text-white placeholder-gray-600',
                'text-lg font-medium border transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-violet-500',
                error ? 'border-red-500' : 'border-gray-700 focus:border-violet-500',
              ].join(' ')}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95
              text-white font-bold text-lg transition-all"
          >
            Join Session
          </button>
        </form>

        <p className="text-center text-xs text-gray-600">
          Your name will be saved for this session
        </p>
      </div>
    </div>
  )
}
