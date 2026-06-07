'use client'

import type { RoundStatus } from '@/lib/types'

interface HostControlsProps {
  roundStatus: RoundStatus
  currentRound: number
  onStart: () => void
  onLock: () => void
  onReset: () => void
  onClear: () => void
}

export default function HostControls({
  roundStatus,
  currentRound,
  onStart,
  onLock,
  onReset,
  onClear,
}: HostControlsProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Round Controls
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Round</span>
          <span className="text-sm font-bold text-white bg-gray-800 px-2.5 py-0.5 rounded-full">
            {currentRound}
          </span>
          <StatusBadge status={roundStatus} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onStart}
          disabled={roundStatus === 'open'}
          className="flex-1 min-w-30 px-4 py-3 rounded-xl font-bold text-sm transition-all
            bg-green-600 hover:bg-green-500 active:scale-95 text-white
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          ▶ Start Round
        </button>

        <button
          onClick={onLock}
          disabled={roundStatus !== 'open'}
          className="flex-1 min-w-30 px-4 py-3 rounded-xl font-bold text-sm transition-all
            bg-amber-600 hover:bg-amber-500 active:scale-95 text-white
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          🔒 Lock Round
        </button>

        <button
          onClick={onReset}
          className="flex-1 min-w-30 px-4 py-3 rounded-xl font-bold text-sm transition-all
            bg-blue-600 hover:bg-blue-500 active:scale-95 text-white"
        >
          ↺ Reset Round
        </button>
      </div>

      <div className="pt-1 border-t border-gray-800">
        <button
          onClick={onClear}
          className="w-full px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
            bg-gray-800 hover:bg-red-900/50 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-800"
        >
          ✕ Clear All Participants
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: RoundStatus }) {
  if (status === 'open') {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
        OPEN
      </span>
    )
  }
  if (status === 'locked') {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
        LOCKED
      </span>
    )
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-700 text-gray-500 border border-gray-600">
      WAITING
    </span>
  )
}
