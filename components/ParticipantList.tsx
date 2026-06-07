'use client'

import type { Participant } from '@/lib/types'

interface ParticipantListProps {
  participants: Participant[]
}

export default function ParticipantList({ participants }: ParticipantListProps) {
  const connected = participants.filter((p) => p.connected)
  const disconnected = participants.filter((p) => !p.connected)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Participants
        </p>
        <span className="text-sm font-bold text-white bg-gray-800 px-2.5 py-0.5 rounded-full">
          {connected.length}
          {disconnected.length > 0 && (
            <span className="text-gray-500 font-normal"> / {participants.length}</span>
          )}
        </span>
      </div>

      {participants.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">
          No participants yet. Share the session code!
        </p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {connected.map((p) => (
            <li key={p.socketId} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-white text-sm font-medium truncate">{p.name}</span>
            </li>
          ))}
          {disconnected.map((p) => (
            <li key={p.socketId} className="flex items-center gap-3 opacity-40">
              <span className="w-2 h-2 rounded-full bg-gray-600 shrink-0" />
              <span className="text-gray-400 text-sm truncate">{p.name}</span>
              <span className="text-xs text-gray-600 ml-auto shrink-0">offline</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
