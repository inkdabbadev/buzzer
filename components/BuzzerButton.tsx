'use client'

interface BuzzerButtonProps {
  status: 'waiting' | 'active' | 'buzzed' | 'locked'
  order?: number
  onClick: () => void
}

export default function BuzzerButton({ status, order, onClick }: BuzzerButtonProps) {
  const disabled = status !== 'active'

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label="Buzz"
        className={[
          'relative w-56 h-56 rounded-full font-black text-3xl tracking-widest',
          'transition-all duration-150 select-none',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950',
          status === 'active' &&
            'bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-[0_0_60px_rgba(239,68,68,0.6)] animate-pulse hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-red-500',
          status === 'waiting' &&
            'bg-gray-800 text-gray-600 cursor-not-allowed shadow-none border-2 border-gray-700',
          status === 'locked' &&
            'bg-gray-800 text-gray-600 cursor-not-allowed shadow-none border-2 border-gray-700',
          status === 'buzzed' &&
            'bg-gradient-to-br from-green-500 to-emerald-400 text-white shadow-[0_0_60px_rgba(34,197,94,0.5)] cursor-not-allowed',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {status === 'active' && 'BUZZ!'}
        {status === 'waiting' && '⏳'}
        {status === 'locked' && '🔒'}
        {status === 'buzzed' && (order ? `#${order}` : '✓')}
      </button>

      <p className="text-center text-base font-medium">
        {status === 'active' && (
          <span className="text-red-400 animate-pulse">Hit it — first one wins!</span>
        )}
        {status === 'waiting' && (
          <span className="text-gray-500">Waiting for host to open the round</span>
        )}
        {status === 'locked' && (
          <span className="text-gray-500">Round is locked by the host</span>
        )}
        {status === 'buzzed' && order && (
          <span className="text-green-400">
            You buzzed in at position <strong>#{order}</strong>
          </span>
        )}
        {status === 'buzzed' && !order && (
          <span className="text-green-400">Buzzed!</span>
        )}
      </p>
    </div>
  )
}
