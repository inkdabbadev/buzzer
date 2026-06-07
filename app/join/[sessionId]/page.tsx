'use client'

import { use, useEffect, useState } from 'react'
import { getSocket } from '@/lib/socket'
import type {
  RoundStatus,
  JoinedSessionPayload,
  JoinErrorPayload,
  RoundStatusChangePayload,
  BuzzedConfirmedPayload,
} from '@/lib/types'
import NameLogin from '@/components/NameLogin'
import BuzzerButton from '@/components/BuzzerButton'

const STORAGE_KEY = 'buzzerParticipantName'

type BuzzerStatus = 'waiting' | 'active' | 'buzzed' | 'locked'

export default function ParticipantPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)

  const [name, setName] = useState<string | null>(null)
  const [joined, setJoined] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roundStatus, setRoundStatus] = useState<RoundStatus>('waiting')
  const [buzzOrder, setBuzzOrder] = useState<number | null>(null)

  // Load saved name from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setName(saved)
  }, [])

  // Set up socket after name is known
  useEffect(() => {
    if (!name) return

    const socket = getSocket()

    function onConnect() {
      setConnected(true)
      socket.emit('join-session', { sessionId, name })
    }

    function onDisconnect() {
      setConnected(false)
      setJoined(false)
    }

    function onJoinedSession({ roundStatus, hasBuzzed }: JoinedSessionPayload) {
      setJoined(true)
      setRoundStatus(roundStatus)
      if (hasBuzzed) setBuzzOrder(-1) // unknown order from previous connection
    }

    function onJoinError({ message }: JoinErrorPayload) {
      setError(message)
    }

    function onRoundStatusChange({ roundStatus }: RoundStatusChangePayload) {
      setRoundStatus(roundStatus)
      if (roundStatus === 'waiting') {
        setBuzzOrder(null) // new round — reset buzzed state
      }
    }

    function onBuzzedConfirmed({ order }: BuzzedConfirmedPayload) {
      setBuzzOrder(order)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('joined-session', onJoinedSession)
    socket.on('join-error', onJoinError)
    socket.on('round-status-change', onRoundStatusChange)
    socket.on('buzzed-confirmed', onBuzzedConfirmed)

    if (socket.connected) {
      onConnect()
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('joined-session', onJoinedSession)
      socket.off('join-error', onJoinError)
      socket.off('round-status-change', onRoundStatusChange)
      socket.off('buzzed-confirmed', onBuzzedConfirmed)
    }
  }, [name, sessionId])

  function handleNameJoin(enteredName: string) {
    localStorage.setItem(STORAGE_KEY, enteredName)
    setName(enteredName)
  }

  function handleBuzz() {
    if (!joined) return
    getSocket().emit('buzz', { sessionId })
  }

  function getBuzzerStatus(): BuzzerStatus {
    if (buzzOrder !== null) return 'buzzed'
    if (roundStatus === 'open') return 'active'
    if (roundStatus === 'locked') return 'locked'
    return 'waiting'
  }

  if (!name) {
    return <NameLogin sessionId={sessionId} onJoin={handleNameJoin} />
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-2xl font-bold text-white">Session Not Found</h2>
          <p className="text-gray-400">{error}</p>
          <div className="space-y-3">
            <a
              href="/join"
              className="block w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all"
            >
              Try Another Code
            </a>
            <a
              href="/"
              className="block w-full py-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </main>
    )
  }

  const buzzerStatus = getBuzzerStatus()

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between max-w-lg mx-auto w-full">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">Session</p>
          <p className="font-mono font-black text-2xl text-violet-400 tracking-[0.2em]">
            {sessionId}
          </p>
        </div>
        <div className="text-right space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">You</p>
          <p className="font-bold text-white truncate max-w-35">{name}</p>
        </div>
      </header>

      <div className="flex justify-center pb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={[
              'w-2 h-2 rounded-full',
              connected ? 'bg-green-400 animate-pulse' : 'bg-red-500',
            ].join(' ')}
          />
          <span className={['text-xs font-medium', connected ? 'text-green-400' : 'text-red-400'].join(' ')}>
            {connected ? (joined ? 'Connected' : 'Joining…') : 'Reconnecting…'}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <BuzzerButton
          status={buzzerStatus}
          order={buzzOrder !== null && buzzOrder > 0 ? buzzOrder : undefined}
          onClick={handleBuzz}
        />
      </div>

      <footer className="pb-8 text-center">
        <p className="text-gray-700 text-xs">Keep this screen open during the event</p>
      </footer>
    </main>
  )
}
