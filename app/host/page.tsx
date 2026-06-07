'use client'

import { useEffect, useRef, useState } from 'react'
import { getSocket } from '@/lib/socket'
import type {
  Session,
  Participant,
  Buzz,
  RoundStatus,
  SessionCreatedPayload,
  SessionStatePayload,
  ParticipantListUpdatePayload,
  RoundStatusChangePayload,
  BuzzUpdatePayload,
  JoinErrorPayload,
} from '@/lib/types'
import SessionCodeCard from '@/components/SessionCodeCard'
import ParticipantList from '@/components/ParticipantList'
import BuzzOrderList from '@/components/BuzzOrderList'
import HostControls from '@/components/HostControls'

type HostView = 'pre-create' | 'dashboard'

export default function HostPage() {
  const [view, setView] = useState<HostView>('pre-create')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [buzzes, setBuzzes] = useState<Buzz[]>([])
  const [roundStatus, setRoundStatus] = useState<RoundStatus>('waiting')
  const [currentRound, setCurrentRound] = useState(1)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  useEffect(() => {
    const socket = getSocket()

    function onConnect() {
      setConnected(true)
      const stored = localStorage.getItem('hostSessionId')
      if (stored) {
        socket.emit('host-join', { sessionId: stored })
      }
    }

    function onDisconnect() {
      setConnected(false)
    }

    function onSessionCreated({ sessionId }: SessionCreatedPayload) {
      localStorage.setItem('hostSessionId', sessionId)
      setSessionId(sessionId)
      setView('dashboard')
    }

    function onSessionState({ session }: SessionStatePayload) {
      setSessionId(session.sessionId)
      setParticipants(session.participants)
      setBuzzes(session.buzzes)
      setRoundStatus(session.roundStatus)
      setCurrentRound(session.currentRound)
      setView('dashboard')
    }

    function onParticipantListUpdate({ participants }: ParticipantListUpdatePayload) {
      setParticipants(participants)
    }

    function onRoundStatusChange({ roundStatus, currentRound, buzzes }: RoundStatusChangePayload) {
      setRoundStatus(roundStatus)
      setCurrentRound(currentRound)
      setBuzzes(buzzes)
    }

    function onBuzzUpdate({ buzzes }: BuzzUpdatePayload) {
      setBuzzes(buzzes)
    }

    function onJoinError({ message }: JoinErrorPayload) {
      localStorage.removeItem('hostSessionId')
      setError(message)
      setView('pre-create')
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('session-created', onSessionCreated)
    socket.on('session-state', onSessionState)
    socket.on('participant-list-update', onParticipantListUpdate)
    socket.on('round-status-change', onRoundStatusChange)
    socket.on('buzz-update', onBuzzUpdate)
    socket.on('join-error', onJoinError)

    if (socket.connected) {
      onConnect()
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('session-created', onSessionCreated)
      socket.off('session-state', onSessionState)
      socket.off('participant-list-update', onParticipantListUpdate)
      socket.off('round-status-change', onRoundStatusChange)
      socket.off('buzz-update', onBuzzUpdate)
      socket.off('join-error', onJoinError)
    }
  }, [])

  function createSession() {
    const socket = getSocket()
    socket.emit('create-session')
  }

  function startNewSession() {
    localStorage.removeItem('hostSessionId')
    setSessionId(null)
    setParticipants([])
    setBuzzes([])
    setRoundStatus('waiting')
    setCurrentRound(1)
    setError(null)
    setView('pre-create')
  }

  function handleStart() {
    if (!sessionId) return
    getSocket().emit('start-round', { sessionId })
  }

  function handleLock() {
    if (!sessionId) return
    getSocket().emit('lock-round', { sessionId })
  }

  function handleReset() {
    if (!sessionId) return
    getSocket().emit('reset-round', { sessionId })
  }

  function handleClear() {
    if (!sessionId) return
    if (!confirm('Remove all participants and reset the round?')) return
    getSocket().emit('clear-participants', { sessionId })
  }

  if (view === 'pre-create') {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-2">
            <div className="text-5xl">🎙</div>
            <h1 className="text-4xl font-black text-white tracking-tight">Host Dashboard</h1>
            <p className="text-gray-500">Create a new buzzer session for your event</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={createSession}
            disabled={!connected}
            className="w-full py-5 rounded-2xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98]
              text-white font-bold text-xl transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connected ? '✦ Create Session' : 'Connecting…'}
          </button>

          <ConnectionDot connected={connected} />
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <span className="font-black text-xl tracking-tight">Buzzer</span>
          <span className="text-gray-600 text-sm ml-1">Host Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <ConnectionDot connected={connected} />
          <button
            onClick={startNewSession}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            + New Session
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sessionId && baseUrl && (
            <SessionCodeCard sessionId={sessionId} baseUrl={baseUrl} />
          )}
          <HostControls
            roundStatus={roundStatus}
            currentRound={currentRound}
            onStart={handleStart}
            onLock={handleLock}
            onReset={handleReset}
            onClear={handleClear}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParticipantList participants={participants} />
          <BuzzOrderList buzzes={buzzes} />
        </div>
      </div>
    </div>
  )
}

function ConnectionDot({ connected }: { connected: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={[
          'w-2 h-2 rounded-full',
          connected ? 'bg-green-400 animate-pulse' : 'bg-red-500',
        ].join(' ')}
      />
      <span className={['text-xs', connected ? 'text-green-400' : 'text-red-400'].join(' ')}>
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  )
}
