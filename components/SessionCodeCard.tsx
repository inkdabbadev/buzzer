'use client'

import { useState } from 'react'

interface SessionCodeCardProps {
  sessionId: string
  baseUrl: string
}

export default function SessionCodeCard({ sessionId, baseUrl }: SessionCodeCardProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const joinLink = `${baseUrl}/join/${sessionId}`

  async function copyCode() {
    await navigator.clipboard.writeText(sessionId)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(joinLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        Session Code
      </p>

      {/* Big code display */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-5xl font-black tracking-[0.3em] text-violet-400 select-all">
          {sessionId}
        </span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 hover:text-white transition-colors"
        >
          {copiedCode ? '✓ Copied' : '⎘ Copy'}
        </button>
      </div>

      {/* Join link */}
      <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
        <span className="text-sm text-gray-400 font-mono truncate flex-1 select-all">
          {joinLink}
        </span>
        <button
          onClick={copyLink}
          className="shrink-0 px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          {copiedLink ? '✓ Copied!' : 'Copy Link'}
        </button>
      </div>

      <p className="text-xs text-gray-600">
        Share this code or link with participants
      </p>
    </div>
  )
}
