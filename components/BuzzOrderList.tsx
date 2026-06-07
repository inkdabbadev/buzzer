'use client'

import type { Buzz } from '@/lib/types'

interface BuzzOrderListProps {
  buzzes: Buzz[]
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const medals = ['🥇', '🥈', '🥉']
const orderColors = [
  'from-yellow-500 to-amber-400 text-gray-950 border-yellow-500/50',
  'from-gray-400 to-gray-300 text-gray-950 border-gray-400/50',
  'from-orange-600 to-amber-600 text-white border-orange-600/50',
]

export default function BuzzOrderList({ buzzes }: BuzzOrderListProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Buzz Order
        </p>
        {buzzes.length > 0 && (
          <span className="text-sm font-bold text-white bg-gray-800 px-2.5 py-0.5 rounded-full">
            {buzzes.length}
          </span>
        )}
      </div>

      {buzzes.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">
          No buzzes yet this round
        </p>
      ) : (
        <ol className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {buzzes.map((buzz) => {
            const isTop3 = buzz.order <= 3
            const colorClass = orderColors[buzz.order - 1] ?? 'from-gray-700 to-gray-600 text-white border-gray-600/50'
            return (
              <li
                key={`${buzz.participantSocketId}-${buzz.order}`}
                className={[
                  'flex items-center gap-3 rounded-xl px-4 py-3 border',
                  isTop3
                    ? `bg-gradient-to-r ${colorClass}`
                    : 'bg-gray-800 border-gray-700 text-white',
                ].join(' ')}
              >
                <span className="text-lg font-black w-8 shrink-0 text-center">
                  {isTop3 ? medals[buzz.order - 1] : `#${buzz.order}`}
                </span>
                <span className="font-bold flex-1 truncate text-sm">
                  {buzz.participantName}
                </span>
                <span className={['text-xs shrink-0 font-mono', isTop3 ? 'opacity-70' : 'text-gray-500'].join(' ')}>
                  {formatTime(buzz.buzzedAt)}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
